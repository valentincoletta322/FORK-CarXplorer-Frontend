import { Component } from '@angular/core';
import { PublicacionesService } from '../services/publicaciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  publicaciones: any;
  filterResults: boolean = false;
  titleFilter: string = '';
  maxPriceFilter!: any;
  minPriceFilter!: any;
  page: number =1;
  statusSearch: string = '';
  sellerFilter: string = '';
  currencyFilter: string = '';
  greeting: string = '¡Hola, ' + (localStorage.getItem('username') || 'bienvenido') + '!';
  addrCity: string = '';
  lastPage: boolean = false;
  constructor(private pubService: PublicacionesService, private router: Router) {
    this.publicaciones = [];
  }

  formatQuery(): string {
    let filter: string = '';
    if (this.titleFilter != '') {
      filter += 'title=' + this.titleFilter + '&';
    }
    if (this.currencyFilter != '') {
      filter += 'currency=' + this.currencyFilter + '&';
    }
    if (this.minPriceFilter) {
      filter += 'minprice=' + this.minPriceFilter + '&';
    }
    if (this.maxPriceFilter) {
      if (this.maxPriceFilter<this.minPriceFilter){
        this.maxPriceFilter = '';
      }
      filter += 'maxprice=' + this.maxPriceFilter + '&';
    }
    if (this.addrCity != '') {
      if(this.addrCity != 'Cualquiera')
      filter += 'city=' + this.addrCity + '&';
    }
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

  restartFilters(){
    this.titleFilter = '';
    this.currencyFilter = '';
    this.minPriceFilter = '';
    this.maxPriceFilter = '';
    this.addrCity = '';
    this.filterResults = false;
    this.pubService.cargarPublicaciones(this.page-1).subscribe((data) => {
      this.publicaciones = JSON.parse(JSON.stringify(data));
    });
  }

  ngOnInit(): void {
    this.pubService.cargarPublicaciones(this.page-1).subscribe((data) => {
      console.log(data)
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
    this.router.navigate(['/listing/', publicacion.listingNumber]);
  }

  cambiarPagina(number: number) {
    this.page = number;
    this.pubService.buscarPublicaciones(this.formatQuery(),this.page-1).subscribe((data) => {
      this.publicaciones = JSON.parse(JSON.stringify(data));
    });
  }

  neighborhoods: string[] = [
    'Cualquiera',
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

}


