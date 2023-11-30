import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private router: Router) {}

  showSearch: boolean = false;
  searchQuery: string = '';

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  onSearch() {
    console.log('Realizando búsqueda: ' + this.searchQuery);
  }
  ngOnInit() {
  }

  redirectProfile(){
    this.router.navigate(["/profile/"+localStorage.getItem('username')])
    .then(() => {
      window.location.reload();
    });
  }

}
