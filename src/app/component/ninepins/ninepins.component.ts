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
    });

    let allPainsUrl = '/ninepins/' + this.painManager.getYear() + '_' + (this.painManager.getMonth() + 1) + '/pains/';
    this.allPains = this.fireDatabase.list(allPainsUrl).snapshotChanges();
    this.painsTypes = this.fireDatabase.list('/pains').valueChanges();
    this.setTotalPainForUsers();
    this.calculateAveragePain();
  }

  private setUserSoll(user: any){    
    let url = '/users/' + user.id + '/painCashRegister';

    this.fireDatabase.list(url).valueChanges().forEach(cr => {
      var sum = 0;
      cr.forEach(b => {
        sum += +b;
      });
      user.totalPain = sum;
    })
  }

  private setTotalPainForUsers() {
    this.users.subscribe(users => {
      users.forEach(user => {
        this.getTotalPainForUser(user);
      });
    });
  }

  getTotalPainForUser(user: any) {
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


  onSelect(user: any): void {
    this.selectedUser = user;
    this.manualPain = 0;
    this.setUserSoll(user);
    this.getTotalPainForUser(user);
    this.calculateAveragePain();
  }

  addPain(user: any, pain: any) {
    if(pain['specialty'] != undefined
      && pain['specialty'].includes("für alle")){
        this.users.forEach(users => {
          users.forEach(u => {
            if(u.id != user.id && u.active){
              this.painManager.addPainFor(u.id, pain.amount);
            }
          });
        });
      }
    
    else {
      this.painManager.addPainFor(user.id, pain.amount);
    }
    this.calculateAveragePain();
  }

  addManualPain(){
    this.painManager.addPainFor(this.selectedUser.id, this.manualPain);
  }

  cancelPain(user: any, painKey: Date) {
    this.fireDatabase.object('/ninepins/' + this.painManager.getYear() + '_' +
      (this.painManager.getMonth() + 1) + '/pains/' + user.id + '/' + painKey).remove();
      this.calculateAveragePain();
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
          pain = Math.ceil( (pain * 2 ) ) / 2;
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
            pain = Math.ceil( (pain * 2 ) ) / 2;    
            this.painManager.finishUser(user.id, pain);
            this.cashRegisterService.addPains(user.id, pain);
          });
        }
      })
    });
    alert("Auswertung berechnet!!!");
  }

  deleteAllPainsForUser(user: any) {
    let url = '/ninepins/' + this.painManager.getYear() + '_' + (this.painManager.getMonth() + 1) + '/pains/' + user.id + '/';
    this.fireDatabase.list(url).remove();
    user.painToday = 0;
  }

  private calculateAveragePain() {
    var painTodaySum = 0;
    var average = 0;

    this.allPains.subscribe(
      userPains => userPains.forEach( user => {
        let urlPainsOfUser = '/ninepins/' + this.painManager.getYear() + '_' + (this.painManager.getMonth() + 1) + '/pains/' + user.key;
        this.fireDatabase.list(urlPainsOfUser).valueChanges().forEach(pains => pains.forEach(pain => {         
          painTodaySum += +pain;
          average = Math.round(painTodaySum / this.countActiveUsers * 10) / 10;
          // console.log("TotalPainToday:", this.totalPainToday, "CountActiveUsers:", this.countActiveUsers, "Average:", this.averagePain);
          // console.log("TotalPainToday:", this.totalPainToday, "CountActiveUsers:", this.countActiveUsers, "Average:", average);
          this.totalPainToday = painTodaySum;
          this.averagePain = average;          
        }));
      }));
  }
}