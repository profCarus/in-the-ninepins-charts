import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'my-members',
  templateUrl: './members.component.html',
  styleUrls: [ './members.component.css' ]
})
export class MembersComponent {
  users: Observable<any[]>;
  selectedUser: any;

  constructor(
    private router: Router,
    private fireDatabase: AngularFireDatabase
  ) {
    this.users = fireDatabase.list('/users').valueChanges();
  }

  onSelect(user: any): void {
    // this.selectedUser = user;
    this.router.navigate(['/detail', user.id]);
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedUser.id]);
  }
}