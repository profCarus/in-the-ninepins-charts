import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject, AngularFireAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { PainManagerService } from '../../providers/painmanager.service';

@Component({
  selector: 'app-financial-statement',
  templateUrl: './financial-statement.component.html',
  styleUrls: ['./financial-statement.component.css']
})
export class FinancialStatementComponent implements OnInit {
  average: Observable<{}>;
  financialStatement: Observable<{}[]>;
  year: string;
  month: string;

  userNames: string[];

  constructor(private fireDatabase: AngularFireDatabase, private painManager: PainManagerService) {
    this.month = this.painManager.getMonthName();
    this.year = this.painManager.year.toString();

    
    this.average = this.fireDatabase.object('/ninepins/' + this.year + '_' + (this.painManager.getMonth() + 1) + '/average/').valueChanges();

    this.userNames = new Array();
    this.fireDatabase.list('/users').snapshotChanges().forEach(allUsers => {
      allUsers.forEach(user => {
        this.userNames.push(user.payload.val()['name']);
      });
    });
  }

  ngOnInit() {
    this.getFinancialStatement();
  }

  getFinancialStatement() {
    const url = '/ninepins/' + this.year + '_' + (this.painManager.getMonth() + 1) + '/financialStatement';
    // const url = '/ninepins/2017_11/financialStatement';
    
    this.financialStatement = this.fireDatabase.list(url).snapshotChanges();
  }

  getUserName(userId: Number){
    return this.userNames[0 + +userId - 1];
  }
}