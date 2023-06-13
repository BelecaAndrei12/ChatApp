import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/public/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  loggedUser: User  =  this.authService.getLoggedUser()

  constructor(
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  redirectToDashboard(): void {
    setTimeout(() => {
      this.router.navigate(['/private/chat-dashboard']);
    }, 500);
  }

}
