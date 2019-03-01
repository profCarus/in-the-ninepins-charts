import { PainManagerService } from '../../providers/painmanager.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CashRegisterService } from '../../providers/cash-register.service';

@Component({
  selector: 'my-ninepins',
  templateUrl: './ninepins.component.html',
  styleUrls: ['./ninepins.component.css', '../members/members.component.css']
})
export class NinepinsComponent {
  users: Observable<any[]>;
  userPains: Observable<any[]>;
  allPains: Observable<any[]>;
  painsTypes: Observable<any[]>;

  countActiveUsers: number;
  selectedUser: any;
  month: string;
  year: string;

  totalPainToday: number;
  averagePain: number;
  manualPain: number;
  allInclusive = 2; // Bahnpauschale

  constructor(
    private router: Router, private fireDatabase: AngularFireDatabase,
    private painManager: PainManagerService,
    private cashRegisterService: CashRegisterService
  ) {
    // ng build --prod

    this.month = this.painManager.getMonthName();
    this.year = this.painManager.year.toString();

    this.users = fireDatabase.list('/users').valueChanges();

    this.users.subscribe(users => {
      this.countActiveUsers = users.filter(user => user.active == true).length;
      users.forEach(user => this._getTotalPainForUser(user));
    });

    let allPainsUrl = '/ninepins/' + this.painManager.getYear() + '_' + (this.painManager.getMonth() + 1) + '/pains/';
    this.allPains = this.fireDatabase.list(allPainsUrl).snapshotChanges();
    this.painsTypes = this.fireDatabase.list('/pains').valueChanges();
    this._calculateAveragePain();
  }

  onSelect(user: any): void {
    this.selectedUser = user;
    this.manualPain = 0;
    // this._setUserSoll(user);
    this._getTotalPainForUser(user);
    this._calculateAveragePain();
  }

  addPain(user: any, pain: any) {
    if (pain['specialty'] != undefined
      && pain['specialty'].includes("für alle")) {
      this.users.forEach(users => {
        users.forEach(u => {
          if (u.id != user.id && u.active) {
            this.painManager.addPainFor(u.id, pain.amount);
          }
        });
      });
    }

    else {
      this.painManager.addPainFor(user.id, pain.amount);
    }
    this._calculateAveragePain();
  }

  addManualPain() {
    this.painManager.addPainFor(this.selectedUser.id, this.manualPain);
    this._calculateAveragePain();
  }

  cancelPain(user: any, painKey: Date) {
    this.fireDatabase.object('/ninepins/' + this.painManager.getYear() + '_' +
      (this.painManager.getMonth() + 1) + '/pains/' + user.id + '/' + painKey).remove();
    this._calculateAveragePain();
  }

  finishNinepins() {
    let url = '/ninepins/' + this.painManager.getYear() + '_' + (this.painManager.getMonth() + 1) + '/financialStatement/';
    this.fireDatabase.list(url).remove();

    this.users.forEach(users => {
      users.forEach(user => {

        // Store Average
        this.fireDatabase.object('/ninepins/' + this.year + '_' + (this.painManager.getMonth() + 1) + '/average/').set(this.averagePain);

        // console.log(user);
        // this.painManager.finishUser(user.id, 2);

        if (!user.activeMember) {
          this.painManager.finishUser(user.id, 5);
          // this.cashRegisterService.addPains(user.id, 5);
        }

        else if (user.active == false) {
          let pain = this.allInclusive + this.averagePain;
          pain = Math.ceil((pain * 2)) / 2;
          this.painManager.finishUser(user.id, pain);
          this.cashRegisterService.addPains(user.id, pain);
        }

        else {
          let url = '/ninepins/' + this.painManager.getYear() + '_' + (this.painManager.getMonth() + 1) + '/pains/' + user.id;
          this.fireDatabase.list(url).snapshotChanges().subscribe(pains => {
            var painSum = 0;
            pains.forEach(pain => {
              painSum = painSum + +pain.payload.val();
            });

            var pain = Math.round((this.allInclusive + painSum) * 10) / 10;
            pain = Math.ceil((pain * 2)) / 2;
            this.painManager.finishUser(user.id, pain);
            this.cashRegisterService.addPains(user.id, pain);
          });
        }
      })
    });
    alert("Auswertung berechnet!!!");
  }

  private _getTotalPainForUser(user: any) {
    this.userPains = this.fireDatabase.list('/ninepins/' + this.painManager.getYear() + '_' +
      (this.painManager.getMonth() + 1) + '/pains/' + user.id).snapshotChanges();
    this.userPains.subscribe(pains => {
      var painSum = 0;
      pains.forEach(pain => {
        painSum = painSum + +pain.payload.val();
      })
      user.painToday = painSum;
    });
  }

  private _calculateAveragePain() {
    this.totalPainToday = 0;
    this.averagePain = 0;
    this._sumOfAllPains().then(painTodaySum => {
      this.totalPainToday = painTodaySum;
      this.averagePain = Math.round(painTodaySum / this.countActiveUsers * 10) / 10;
    });
  }

  private _sumOfAllPains(): Promise<number> {
    var painTodaySum = 0;
    return new Promise<number>((resolve) => {
      for (let i = 1; i <= 12; i++) {
        let urlPainsOfUser = '/ninepins/' + this.painManager.getYear() + '_' + (this.painManager.getMonth() + 1) + '/pains/' + i;
        this.fireDatabase.list(urlPainsOfUser).valueChanges().forEach(pains => {
          pains.forEach(pain => {
            painTodaySum += +pain;
          });
          if (i === 12)
            resolve(painTodaySum);
        });
      }
    });
  }
}