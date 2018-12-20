import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = '"In the ninepins chart"';

  members: Observable<any[]>;
  constructor(db: AngularFireDatabase) {
    this.members = db.list('/users').valueChanges();
  }

}