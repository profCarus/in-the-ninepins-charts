import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from '../../component/dashboard/dashboard.component';
import { MembersComponent } from '../../component/members/members.component';
import { MemberDetailComponent } from '../../component/member-detail/member-detail.component';
import { NinepinsComponent } from '../../component/ninepins/ninepins.component';
import { FinancialStatementComponent } from '../../component/financial-statement/financial-statement.component';
import { PainsComponent } from '../../component/pains/pains.component';
import { LoginComponent } from '../../component/login/login.component';
import { AuthGuard } from '../../guard/auth.guard';
import { StatisticComponent } from '../../component/statistic/statistic.component';


// const routes: Routes = [
//   { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
//   { path: 'login', component: LoginComponent },
//   { path: 'dashboard', component: DashboardComponent },
//   { path: 'detail/:id', canActivate: [AuthGuard], component: MemberDetailComponent },
//   { path: 'members', canActivate: [AuthGuard], component: MembersComponent },
//   { path: 'ninepins', canActivate: [AuthGuard], component: NinepinsComponent },
//   { path: 'financialStatement', component: FinancialStatementComponent },
//   { path: 'statistic', component: StatisticComponent },  
//   { path: 'pains', component: PainsComponent },
// ];

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: MemberDetailComponent },
  { path: 'members', component: MembersComponent },
  { path: 'ninepins', component: NinepinsComponent },
  { path: 'financialStatement', component: FinancialStatementComponent },
  { path: 'statistic', component: StatisticComponent },  
  { path: 'pains', component: PainsComponent },
];

// const routes: Routes = [
//   { path: '', redirectTo: '/login', pathMatch: 'full' },
//   { path: 'login', component: LoginComponent },
//   { path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent },
//   { path: 'detail/:id', canActivate: [AuthGuard], component: MemberDetailComponent },
//   { path: 'members', canActivate: [AuthGuard], component: MembersComponent },
//   { path: 'ninepins', canActivate: [AuthGuard], component: NinepinsComponent },
//   { path: 'financialStatement', canActivate: [AuthGuard], component: FinancialStatementComponent },
//   { path: 'statistic', canActivate: [AuthGuard], component: StatisticComponent },  
//   { path: 'pains', canActivate: [AuthGuard], component: PainsComponent },
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
