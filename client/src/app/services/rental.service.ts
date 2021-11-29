import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Rental } from '../models/Rental';

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  API_URL = 'http://localhost:3000/api';

  constructor(private http:HttpClient) { }

  createRental(rental: Rental){
    return this.http.post(this.API_URL + '/rental', rental);
  }
}
