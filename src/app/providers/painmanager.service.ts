import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class PainManagerService {
    year: string;
    month: number;

    constructor(private fireDatabase: AngularFireDatabase) {
        var date = new Date();
        this.month = date.getMonth();
        this.year = date.getFullYear().toString();
    }

    public setUserForPayAverage(userId: number, payAverage: boolean) {
        // console.log("userId:", userId, "payAverage:", payAverage);
        this.fireDatabase.object('/users/' + userId + '/active/').set(!payAverage);
        this.deleteUserPains(userId);
    }

    public addPainFor(userId: number, pain: number): void {
        const itemObservable = this.fireDatabase.object('/ninepins/' + this.year + '_' + (this.month + 1)
            + '/pains/' + userId + '/' + new Date());
        itemObservable.set(pain);
    }

    public finishUser(userId: number, totalPain: number): void {
        let url = '/ninepins/' + this.year + '_' + (this.month + 1) + '/financialStatement/';
        this.fireDatabase.object(url + userId + '/').set(totalPain);
    }

    public getDatabase() {
        return this.fireDatabase;
    }

    public getMonth() {
        return this.month;
    }

    public getYear() {
        return this.year;
    }

    public getMonthName() {
        var monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni",
            "Juli", "August", "September", "Oktober", "November", "Dezember"
        ];
        return monthNames[this.month];
    }

    private deleteUserPains(userId: number){
        let url = '/ninepins/' + this.year + '_' + (this.month + 1) + '/pains/' + userId;
        this.fireDatabase.object(url).remove();
    }

}