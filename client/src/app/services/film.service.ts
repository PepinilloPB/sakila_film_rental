import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Film } from '../models/Film';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilmService {

  API_URL = 'http://localhost:3000/api';

  constructor(private http:HttpClient) { }

  getFilms(id: String){
    return this.http.get(this.API_URL + '/movie/' + id); 
  }

  getByTitle(search: string){
    return this.http.get(this.API_URL + '/movie/title/' + search); 
  }

  getByActor(search: string){
    return this.http.get(this.API_URL + '/movie/actor/' + search); 
  }

  getById(film_id: string){
    return this.http.get(this.API_URL + '/movie/id/' + film_id);
  }

  getPendingFilms(id: String){
    return this.http.get(this.API_URL + '/movie/pending/' + id); 
  }
}
