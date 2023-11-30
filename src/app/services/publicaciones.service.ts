import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  constructor(private router: Router, private http: HttpClient) {
  }

  readonly ROOT_URL = "http://localhost:3000"

  cargarPublicaciones(page: number){

    let headers = new HttpHeaders({
      'Content-type':"application/json",
      'Authorization': localStorage.getItem('token') || ""
    });
    return this.http.get(this.ROOT_URL+"/listings/all/page/"+page,{headers})
  }

  buscarPublicaciones(query: string, page: number){
      let headers = new HttpHeaders({
        'Content-type':"application/json",
        'Authorization': localStorage.getItem('token') || ""
      });
  
      return this.http.get(this.ROOT_URL+"/listings/search/page/"+page+"?"+query,{headers})
  }

  cargarPublicacionesDeUnVendedor(username: string){

    let headers = new HttpHeaders({
      'Content-type':"application/json",
      'Authorization': localStorage.getItem('token') || ""
    });
    console.log(this.ROOT_URL+"/listings/search?author="+username)
    return this.http.get(this.ROOT_URL+"/listings/search?author="+username,{headers})
  }


  cargarPublicacion(listingNumber: Number){

    let headers = new HttpHeaders({
      'Content-type':"application/json",
      'Authorization': localStorage.getItem('token') || ""
    });

    return this.http.get(this.ROOT_URL+"/listings/single/"+listingNumber,{headers})
  }

  subirPublicacion(data: any){

    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token') || ""
    });

    return this.http.post(this.ROOT_URL+"/listings/", data, {headers})
  }

  borrarPublicacion(listingNumber: Number){
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token') || ""
    });

    return this.http.delete(this.ROOT_URL+"/listings/"+listingNumber+"/", {headers})
  }

  editarPublicacion(data: any, listingNumber: Number){
      
      let headers = new HttpHeaders({
        'Authorization': localStorage.getItem('token') || ""
      });
      return this.http.patch(this.ROOT_URL+"/listings/"+listingNumber+"/", data, {headers})
  }

  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    } else {
      return text.slice(0, maxLength) + '...';
    }
  }


}
