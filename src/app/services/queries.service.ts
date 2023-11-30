import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class QueriesService {

  constructor(private router: Router, private http: HttpClient) {
  }

  readonly ROOT_URL = "http://localhost:3000"

  cargarComentarios(queryId: Number){

    let headers = new HttpHeaders({
      'Content-type':"application/json",
      'Authorization': localStorage.getItem('token') || ""
    });

    return this.http.get(this.ROOT_URL+"/queries/fromListing/"+queryId,{headers})
  }

  publicarComentario(query: any){
      
      let headers = new HttpHeaders({
        'Content-type':"application/json",
        'Authorization': localStorage.getItem('token') || ""
      });

      return this.http.post(this.ROOT_URL+"/queries/", query, {headers})
  }

  responderComentario(queryId: any, answer: any){

    let headers = new HttpHeaders({
      'Content-type':"application/json",
      'Authorization': localStorage.getItem('token') || ""
    });
    console.log(answer)
    return this.http.post(this.ROOT_URL+"/queries/answerQuery/"+queryId, answer, {headers})

  }


}
