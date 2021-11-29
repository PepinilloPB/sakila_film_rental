import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Film } from '../models/Film';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  API_URL = 'http://localhost:3000/api';

  constructor(private http:HttpClient) { }

  listCart(){
    return this.http.get(this.API_URL + '/cart');
  }

  addToCart(film: Film | undefined){
    return this.http.post(this.API_URL + '/cart', film);
  }

  removeFromCart(id: String){
    return this.http.delete(this.API_URL + '/cart/'+ id);
  }
}
