import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../providers/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(private authUserService: AuthService){}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot, ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authUserService.getUserLoggedIn();
  }
}
