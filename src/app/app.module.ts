import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './routing/app-routing/app-routing.module';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

import { AuthGuard } from './guard/auth.guard';

import { PainManagerService } from './providers/painmanager.service';
import { AuthService } from './providers/auth.service';
import { CashRegisterService } from './providers/cash-register.service';

import { HeaderComponent } from './component/header/header.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { MemberDetailComponent } from './component/member-detail/member-detail.component';
import { MembersComponent } from './component/members/members.component';
import { NinepinsComponent } from './component/ninepins/ninepins.component';
import { FinancialStatementComponent } from './component/financial-statement/financial-statement.component';
import { StatisticComponent } from './component/statistic/statistic.component';
import { PainsComponent } from './component/pains/pains.component';
import { LoginComponent } from './component/login/login.component';

import {
  MatButtonModule,
  MatCheckboxModule,
  MatSliderModule,
  MatRadioModule,
  MatSelectModule,
  MatDatepickerModule, MatNativeDateModule,
} from '@angular/material';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSliderModule,
    MatRadioModule,
    MatDatepickerModule, MatNativeDateModule,
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    MemberDetailComponent,
    MembersComponent,
    NinepinsComponent,
    FinancialStatementComponent,
    StatisticComponent,
    PainsComponent,
    LoginComponent,
    HeaderComponent,
  ],
  providers: [
    PainManagerService,
    AuthService,
    AuthGuard,
    CashRegisterService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }