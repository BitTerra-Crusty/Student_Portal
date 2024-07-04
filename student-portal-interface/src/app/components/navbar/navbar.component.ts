import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private auth: AuthService){}

  user: any = localStorage.getItem('user');

  logout(){
    this.auth.logOut();
  }
}
