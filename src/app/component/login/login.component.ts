import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoginPage: boolean = true;

  constructor(private router:Router, private authUserService: AuthService) { 
    
  }

  ngOnInit() {

  }

  loginUser(e) {
  	e.preventDefault();
  	// console.log(e);
  	var username = e.target.elements[0].value;
  	var password = e.target.elements[1].value;
    
    // console.log(username, password);

  	if(username == 'kchegels2012@gmail.com' && password == 'hegelhegelhegel') {
      this.authUserService.setUserLoggedIn();
      this.router.navigate(['dashboard']);
  	}
  }

}