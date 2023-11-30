import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { PublicacionesService } from '../services/publicaciones.service';
import { of } from 'rxjs';
declare var L: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  perfil: any = "";
  error!: string;
  searchUsername: any;
  esPropietario!: boolean;
  modoEdicion!: boolean;
  numeroEditable!: string;
  mailEditable!: string;
  statusSearch = '';
  statusEdit: string = '';
  page: number =1;
  publicaciones: any;


  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, private userService: UsersService, private pubService: PublicacionesService) {
    this.publicaciones = [];
  }
  
  async ngOnInit(){
    this.cargarUsuario();
    if(!localStorage.getItem('token')){
      localStorage.setItem('username', '');
      this.router.navigate(['/login']);
    }
  }

  closeError(){
    this.statusEdit = '';
  }

  cargarUsuario(){
    this.esPropietario = false
    this.modoEdicion = false;
    this.searchUsername = this.route.snapshot.paramMap.get('username');

    this.userService.getSingleUser(this.searchUsername).subscribe(
      async (response:any) => {
        this.perfil = JSON.parse(JSON.stringify(response));

        this.userService.getCurrenUser().subscribe(
          (response:any) => {
            this.esPropietario = response.username == this.perfil.username;
          },
          error => {
            console.log("Failed to get current user")
            this.error = error.error;
          }
        )
        this.search()
        this.getGeocodedData(this.perfil.address).subscribe((data: any) => {
          if (data.length > 0) {
            const result = data[0];
            const lat = parseFloat(result.lat);
            const lon = parseFloat(result.lon);
            const address = result.display_name;
            this.initializeMap(lat, lon, address);
          } else {
            console.error("No se encontraron coordenadas para la dirección proporcionada.");
          }
        });
      },
      (error) => {
        console.log(error);
        this.error = error.error;
      });
  }

  cerrarSesion(){
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

  formatQuery(): string {
    let filter: string = "author="+this.perfil.username
    return filter;
  }

  search(){
    console.log(this.formatQuery())
    this.pubService.buscarPublicaciones(this.formatQuery(),0).subscribe((data) => {
      this.publicaciones = JSON.parse(JSON.stringify(data));
      this.page = 1;
      this.statusSearch = '';
    },
    (error) => {
      console.log("No listings found");
      this.statusSearch = 'No se encontraron publicaciones para tu búsqueda.';
    }
    );
  }

  cambiarPagina(number: number) {
    this.page = number;
    this.pubService.buscarPublicaciones(this.formatQuery(),this.page-1).subscribe((data) => {
      this.publicaciones = JSON.parse(JSON.stringify(data));
    });
  }

  serviceFormatPrice(price: number) {
    return this.pubService.formatPrice(price);
  }
  
  serviceTruncateText(text: string, maxLength: number) {
    return this.pubService.truncateText(text, maxLength);
  }

  verDescripcion(publicacion: any) {
    console.log(publicacion)
    this.router.navigate(['/listing/', publicacion.listingNumber]);
  }

  nominatimBaseUrl: string = "https://nominatim.openstreetmap.org/search";
  map: any;

  getGeocodedData(address: string) {
    const apiUrl = `${this.nominatimBaseUrl}?q=${encodeURI(address)}&format=json`;
    return this.http.get(apiUrl);
  }

  initializeMap(lat: number, lon: number, address: string) {
    this.map = L.map('map').setView([lat, lon], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);
    const marker = L.marker([lat, lon]).addTo(this.map);
    marker.bindPopup(`<b>Dirección:</b> ${address}`).openPopup();
  }

  editarPerfil() {
    this.modoEdicion = !this.modoEdicion;
    this.numeroEditable = this.perfil.phone;
    this.mailEditable = this.perfil.email;
  }
  
  guardarCambios() {
    if (this.mailEditable!= this.perfil.email && this.mailEditable != '' && this.numeroEditable != ''){
      const data = {
        email: this.mailEditable,
        phone: this.numeroEditable
      }
      this.userService.editarUsuario(data, this.perfil.username).subscribe(
        (response:any) => {
          console.log(response);
          this.modoEdicion = false;
          this.statusEdit = '';
        },
        error => {
          this.statusEdit = error.error;
          console.log(this.statusEdit)
        }
      );
    }

    else if (this.mailEditable == this.perfil.email && this.numeroEditable != ''){
      const data = {
        phone: this.numeroEditable
      }
      this.userService.editarUsuario(data, this.perfil.username).subscribe(
        (response:any) => {
          console.log(response);
          this.modoEdicion = false;
          this.statusEdit = '';
        },
        error => {
          this.statusEdit = error.error;
          console.log(this.statusEdit)
        }
      );
    }
    else this.statusEdit = 'Please complete all fields.'
  }
}




