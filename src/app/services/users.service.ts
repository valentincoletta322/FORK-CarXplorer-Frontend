import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private router: Router, private http: HttpClient) {
  }

  readonly ROOT_URL = "http://localhost:3000"

  goToPage(page: string){
    this.router.navigate([page]);
  }

  crearUsuario(_username: string, _email: string, _password: string, _fullName: string, _isSeller: boolean, _address: string, _phone: number){

    const data: any = {
      username: _username,
      email: _email,
      password: _password,
      fullName: _fullName,
      isSeller: _isSeller,
      address: _address,
      phone: _phone
    }

    let headers = new HttpHeaders({
      'Content-type':"application/json"
    });

    return this.http.post(this.ROOT_URL+"/users/register", data, {headers})
  }

  iniciarSesion(_username: string, _password: string){

    let headers = new HttpHeaders({
      'Content-type':"application/json"
    });

    const data: any = {
      username: _username,
      password: _password
    }

    return this.http.post(this.ROOT_URL+"/users/login", data,{headers})
  }


  getCurrenUser(){

    let headers = new HttpHeaders({
      'Content-type':"application/json",
      'Authorization': localStorage.getItem('token') || ''
    });
    
    return this.http.get(this.ROOT_URL+"/users/ByToken",{headers})
  }

  getSingleUser(username: string){
      
      let headers = new HttpHeaders({
        'Content-type':"application/json",
        'Authorization': localStorage.getItem('token') || ''
      });
      
      return this.http.get(this.ROOT_URL+"/users/single/"+username,{headers})
  }

  editarUsuario(data: any, username: string){
        let headers = new HttpHeaders({
          'Authorization': localStorage.getItem('token') || ""
        });
        return this.http.patch(this.ROOT_URL+"/users/"+username+"/", data, {headers})
  }

}

