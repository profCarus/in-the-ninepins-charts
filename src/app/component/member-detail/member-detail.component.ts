import 'rxjs/add/operator/switchMap';
import { Component, NgModule } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { PainManagerService } from '../../providers/painmanager.service';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { CashRegisterService } from '../../providers/cash-register.service';
import { a } from '@angular/core/src/render3';
import { isNumber } from 'util';

@Component({
  selector: 'member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent {
  user: Observable<any>;
  cashRegister: Observable<any[]>;
  cashRegisterOrdered = [];
  payment: number;
  soll: number;
  vwz: string;
  neuesSoll: number;
  vwzManuellesSoll: string;

  constructor(
    private fireDatabase: AngularFireDatabase,
    private route: ActivatedRoute,
    private location: Location,
    private painManager: PainManagerService,
    private cashRegisterService: CashRegisterService
  ) {
    const id: string = route.snapshot.params.id;
    this.user = this.fireDatabase.object('/users/' + id + '/').valueChanges();
    this.user.subscribe(u => {
      this.user['active'] = u.active;
    });

    this.cashRegister = this.fireDatabase.list('/users/' + id + '/painCashRegister/').snapshotChanges();
    this.payment = 0;
    this.neuesSoll = 0;
    this.vwz = "Einzahlung";
    this.setUserSoll();
    this.setOrderedCashRegister();
  }

  setOrderedCashRegister(): any {
    var cashRegisterOrdered = [];
    this.cashRegister.forEach(entry => {
      entry.forEach(e => {
        var a = e.key.split('_');
        if (+a[1] <= 9)
          a[1] = '0' + a[1];
        cashRegisterOrdered.push({ 'key': a.join('_'), 'soll': e.payload.node_.value_ });
      });
      cashRegisterOrdered.sort(function (a, b) {
        var x = a.key.split('_');
        var y = b.key.split('_');

        if (x[0] == +y[0]) { // gleiches Jahr
          if (+x[1] < +y[1])
            return 1;
          if (+x[1] > +y[1])
            return -1;

          if (isNumber(x[2]) && isNumber(+y[2]) && +x[1] == +y[1]) { // gleicher Monat
            if (+x[2] < +y[2])
              return 1;
            if (+x[2] > +y[2])
              return -1;

            if (+x[2] == +y[2]) { // gleicher Tag              
              if (+x[3] < +y[3])
                return 1;
              if (+x[3] > +y[3])
                return -1;
            }
          }
          return 0;
        }
        else { // unterschiedliche Jahre
          if (+x[0] > +y[0])
            return -1;
          if (+x[0] < +y[0])
            return 1;
        }
        return 0;
      });
      this.cashRegisterOrdered = cashRegisterOrdered;
    });

  }

  setUserSoll() {
    let url = '/users/' + this.route.snapshot.params.id + '/painCashRegister';

    this.fireDatabase.list(url).valueChanges().forEach(cr => {
      var sum = 0;
      cr.forEach(b => {
        sum += +b;
      });
      this.soll = sum;
    });
  }

  setActiveState() {
    this.user['active'] = !this.user['active'];
    const id: string = this.route.snapshot.params.id;
    this.painManager.setUserForPayAverage(+id, !this.user['active']);
  }

  executePayment() {
    this.cashRegisterService.addPayment(this.route.snapshot.params.id, this.payment, this.vwz);
    this.setOrderedCashRegister();
  }

  executeNeuesSoll() {
    if(this.vwzManuellesSoll == undefined)
      return;

    this.cashRegisterService.addPayment(this.route.snapshot.params.id, (this.neuesSoll * -1), this.vwzManuellesSoll);
    this.setOrderedCashRegister();
  }

  goBack(): void {
    this.location.back();
  }
}
