import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'my-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  openPains: Number[];
  members: Observable<any[]>;

  constructor(private fireDatabase: AngularFireDatabase, private authUserService: AuthService ) {
    this.members = fireDatabase.list('/users').valueChanges();
    this.openPains = new Array<Number>();

    this.members.forEach(users => {
      users.forEach(user => {
        this.fireDatabase.list('/users/' + user.id + '/painCashRegister').valueChanges().forEach(cr => {
          var sum = 0;
          cr.forEach(b => {
            sum += +b;
          });
          this.openPains.push(sum);
        });
      })
    });

  }
}
