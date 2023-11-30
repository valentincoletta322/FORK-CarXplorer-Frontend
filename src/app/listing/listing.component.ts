import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicacionesService } from '../services/publicaciones.service';
import { QueriesService } from '../services/queries.service';
import { UsersService } from '../services/users.service';
declare var L: any;
@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent {

  constructor(private router: Router, private http: HttpClient, private pubService: PublicacionesService, private route: ActivatedRoute, private queryService: QueriesService, private userService: UsersService) {
    this.data = {};
    this.publicacion = {};
  }

  data: any;
  publicacion: any;
  listingNumber: any;
  query!: string;
  profileData!: any;
  allQueries: any;
  esPropietario!: boolean;
  statusEdit: string = '';
  modoEdicion!: boolean;
  confirmarBorrar: boolean = false;
  consultaEnviada: boolean = false;
  error: any;

   ngOnInit(){
    this.esPropietario = false
    this.modoEdicion = false;
    this.listingNumber = this.route.snapshot.paramMap.get('listingNumber');
    this.pubService.cargarPublicacion(this.listingNumber).subscribe((data) => {
      this.data = JSON.parse(JSON.stringify(data));
      this.publicacion = this.data.listing;
      this.userService.getSingleUser(this.publicacion.author).subscribe((profile: any) => {
        this.profileData=profile;
        this.getGeocodedData(this.profileData.address).subscribe((data: any) => {
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
      });
      this.userService.getCurrenUser().subscribe(
        (response:any) => {
          console.log("The username is: "+ response.username+ " and the author is: "+ this.publicacion.author )
          this.esPropietario = response.username == this.publicacion.author;
        },
        error => {
          console.log("Failed to get current user")
          this.error = error.error;
        }
      )

    });
    this.cargarComentarios();
  }

  cerrarSesion(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  cargarComentarios(){
    this.queryService.cargarComentarios(this.listingNumber).subscribe((data) => {
      this.allQueries = data;
    });
  }

  publicarComentario(){
    let query = {
      listingNumber: this.listingNumber,
      content: this.query
    }
    this.queryService.publicarComentario(query).subscribe(
      (response:any) => {
        this.cargarComentarios();
        this.consultaEnviada = true;
      },
      error => {
        console.log(error);
        this.error = error.error;
      }
    )
  }

  mostrarFormularioRespuesta(comment: any) {
    comment.mostrandoFormularioRespuesta = true;
  }

  toggleEditMode() {
    this.modoEdicion = !this.modoEdicion;
  }
  
  guardarEdicion() {
    const data = {
      title: this.publicacion.title,
      description: this.publicacion.description,
      price: this.publicacion.price,
      state: this.publicacion.state
    }
    this.pubService.editarPublicacion(data, this.listingNumber).subscribe(
      (response:any) => {
        this.modoEdicion = false;
        this.statusEdit = "";
      },
      error => {
        this.statusEdit = error.error;
        console.log(this.statusEdit);
      }
    )
  }
  
  borrarPublicacion() {
    this.confirmarBorrar = true;
  }

  confirmarBorrarPublicacion() {
    this.pubService.borrarPublicacion(this.listingNumber).subscribe(
      (response:any) => {
        this.router.navigate(['/menu']);
      },
      error => {
        console.log(error);
        this.error = error.error;
      });
  }
  responderComentario(comment: any) {
    const data = {
      answer: comment.respuesta
    }
    this.queryService.responderComentario(comment.queryId, data).subscribe(
      (response:any) => {
        this.cargarComentarios();
        comment.mostrandoFormularioRespuesta = false;
      },
      error => {
        console.log(error);
        this.error = error.error;
      }
    );
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

  closeError(){
    this.statusEdit = '';
  }
  closeConfirmar(){
    this.confirmarBorrar = false;
  }
}

