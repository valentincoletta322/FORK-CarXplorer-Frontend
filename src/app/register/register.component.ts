import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  readonly ROOT_URL = "http://localhost:3000"

  username!: string;
  email!: string;
  password!: string;
  fullName!: string;
  address!: string;
  phone!: number;
  isSeller: boolean = false
  statusRegister!: string;

  addrNumber!: number;
  addrStreet!: string;
  addrCity!: string;
  addrState: string = "Ciudad Autonoma de Buenos Aires";
  addrCountry: string = "Argentina";

  neighborhoods: string[] = [
    'Agronomía',
    'Almagro',
    'Balvanera',
    'Barracas',
    'Belgrano',
    'Boedo',
    'Caballito',
    'Chacarita',
    'Coghlan',
    'Colegiales',
    'Constitución',
    'Flores',
    'La Boca',
    'La Paternal',
    'Liniers',
    'Lomas de Zamora',
    'Monte Castro',
    'Montevideo',
    'Nuñez',
    'Palermo',
    'Parque Chacabuco',
    'Parque Patricios',
    'Parque Avellaneda',
    'Puerto Madero',
    'Recoleta',
    'Retiro',
    'Saavedra',
    'San Cristóbal',
    'San Fernando',
    'San Justo',
    'San Martín',
    'San Nicolás',
    'Saturno',
    'Villa Crespo',
    'Villa del Parque',
    'Villa Devoto',
    'Villa Gral. Mitre',
    'Villa Lugano',
    'Villa Luro',
    'Villa Ortúzar',
    'Villa Pueyrredón',
    'Villa Real',
    'Villa Santa Rita',
    'Villa Soldati',
    'Villa Urquiza'
  ];


  constructor(private router: Router, private http: HttpClient, private userService: UsersService) {
  }

  registerUser(){
    this.address = this.addrNumber + " " + this.addrStreet + ", " + this.addrCity + ", " + this.addrState + ", " + this.addrCountry;
    this.userService.crearUsuario(this.username, this.email, this.password, this.fullName, this.isSeller, this.address, this.phone).subscribe(
      response => {
        console.log(response);
        this.router.navigate(["/login"]);
      },
      error => {
        console.log(error);
        this.statusRegister = error.error;
      }
    )
  }

  toggleSeller() {
    this.isSeller = !this.isSeller;
  }

}
