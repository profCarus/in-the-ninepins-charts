import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class CashRegisterService {

  constructor(private fireDatabase: AngularFireDatabase) {
    
  }

  public addPayment(userId: number, payment: number, vwz: string): void {
    var d = new Date();
    var time = d.getFullYear().toString() + '_' + (d.getMonth() + 1) + '_' + (d.getDate()) + '_' + d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds();

    let url = '/users/' + userId + '/painCashRegister/'  + time + '_' + vwz + '/';
    this.fireDatabase.object(url).set(payment * (-1));

    if(payment > 0){
      let urlBowClubCashReg = '/bowlingClub/cashRegister/'  + time + '_User' + userId + '_' + vwz + '/';
      this.fireDatabase.object(urlBowClubCashReg).set(payment);
    }
  }

  public addPains(userId: number, pain: number): void {
    var d = new Date();
    let url = '/users/' + userId + '/painCashRegister/'  + d.getFullYear().toString() + '_' + (d.getMonth() + 1) + '_pain/';
    this.fireDatabase.object(url).set(pain);
  }
}
