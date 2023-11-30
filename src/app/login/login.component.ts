import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  readonly ROOT_URL = "http://localhost:3000"

  username!: string;
  password!: string;
  statusLogin!: string;

  constructor(private router: Router, private http: HttpClient, private userService: UsersService) {
  }
  
  ngOnInit(){
    if (localStorage.getItem('token')&&localStorage.getItem('username')) {
      this.router.navigate(['/menu']);
    }
  }

  loginUser(){
    this.userService.iniciarSesion(this.username, this.password).subscribe(
      (response:any) => {
        console.log(response);
        const token = response.token;
        localStorage.setItem("token", token)
        localStorage.setItem("username", this.username)
        this.userService.goToPage("/menu");
      },
      error => {
        console.log(error);
        this.statusLogin = error.error;
      }
    );
  }



}
