import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  API_URL = 'http://localhost:3000/api';

  constructor(private http:HttpClient) { }

  getCustomer(){
    return this.http.get(this.API_URL + '/customer/' + 'MARY.SMITH@sakilacustomer.org '); 
  }

  getCustomerByEmail(email: String){
    return this.http.get(this.API_URL + '/customer/' + email); 
  }

  getAddress(customer_id: String){
    return this.http.get(this.API_URL + '/customer/address/' + customer_id);
  }
}
