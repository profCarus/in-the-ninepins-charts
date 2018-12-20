import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { PainManagerService } from '../../providers/painmanager.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {
  year: string;
  month: string;

  monthStart: number;
  yearStart: number;
  
  mapNinepins : Array<Observable<{}>>;

  userNames: string[];
  arrMonth: string[];
  arrPainsSum : number[];
  arrGossen : number[];
  ninepins: Observable<any[]>;
  

  constructor(private fireDatabase: AngularFireDatabase, private painManager: PainManagerService) {
    this.month = this.painManager.getMonthName();
    this.year = this.painManager.year.toString();
    this.monthStart = this.painManager.getMonth() + 1;
    this.yearStart = parseInt(this.painManager.year) - 1
    this.arrMonth = new Array();
    this.arrPainsSum = new Array();
    this.arrGossen = new Array();

    this.mapNinepins = new Array<Observable<{}>>();

    this.userNames = new Array();
    this.fireDatabase.list('/users').snapshotChanges().forEach(allUsers => {
      allUsers.forEach(user => {
        var name = "" + user.payload.val()['name'];
        this.userNames.push(name.split(' ')[0]);
      });
    });
  }

  ngOnInit() {    
    let startDate = new Date(this.yearStart, this.monthStart, 1)
    
    this.generatePainsSummary(startDate);
    
    this.generateGossenStatistic(startDate);
  }
  
  private generatePainsSummary(startDate: Date) {
    this.ninepins = this.fireDatabase.list("/ninepins").snapshotChanges();

    this.ninepins.forEach(x => {
      x.forEach(m => {
        let refMonth = +m.key.split('_')[1];
        let refYear = +m.key.split('_')[0];
        var refDate = new Date(refYear, refMonth, 1);
        if (refDate >= startDate) {
          this.arrMonth.push(m.key);
        }
      });
      this.arrMonth.sort(function (a, b) {
        return new Date(+a.split('_')[0], +a.split('_')[1], 1).getTime()
          - new Date(+b.split('_')[0], +b.split('_')[1], 1).getTime();
      });
      this.arrMonth.forEach(m => {
        let a = this.fireDatabase.list('/ninepins/' + m + '/financialStatement').snapshotChanges();
        this.mapNinepins.push(a);
      });
      this.getSum();
    });
  }

  getSum(){
    for(var i = 0; i < 12; i++){
      this.arrPainsSum[i] = 0;
    }
    this.mapNinepins.forEach(o => {
      o.forEach(pains => {
        for(var i = 0; i < 12; i++){        
          var p = +pains[i].payload.node_.value_;
          this.arrPainsSum[i] += p;
        }
      });
    });    
  }

  generateGossenStatistic(startDate: Date): any {
    for(var i = 0; i < 12; i++){
      this.arrGossen[i] = 0;
    }

    this.ninepins.forEach(x => {
      x.forEach(m => {
        let refMonth = +m.key.split('_')[1];
        let refYear = +m.key.split('_')[0];
        var refDate = new Date(refYear, refMonth, 1);
        if (refDate >= startDate) {
          this.fireDatabase.list("/ninepins/" + m.key + "/pains").snapshotChanges().forEach(user => {
            user.forEach( u => {
              this.fireDatabase.list("/ninepins/" + m.key + "/pains/" + u.key).snapshotChanges().forEach(pain => {
                pain.forEach( p => {
                  if(p.payload.val() == 0.1)
                    this.arrGossen[+u.key - 1]++;
                })
              });
            });
          });
        }
      });
    });
  }

  getUserName(userId: Number){
    return this.userNames[0 + +userId - 1];
  }  
}
