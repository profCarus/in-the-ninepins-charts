import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-pains',
  templateUrl: './pains.component.html',
  styleUrls: ['./pains.component.css']
})
export class PainsComponent implements OnInit {
  pains: Observable<any[]>;
  constructor(private fireDatabase: AngularFireDatabase) { }

  ngOnInit() {
    this.getPains();
  }

  getPains() {
    this.pains = this.fireDatabase.list('/pains').snapshotChanges();
  }
}
