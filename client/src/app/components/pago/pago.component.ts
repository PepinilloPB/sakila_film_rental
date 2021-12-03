import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CartService } from 'src/app/services/cart.service';
import { Customer } from 'src/app/models/Customer';
import { CustomerService } from 'src/app/services/customer.service';
import { Address } from 'src/app/models/Address';
import { Rental } from 'src/app/models/Rental';
import { RentalService } from 'src/app/services/rental.service';

import { Location } from '@angular/common'

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {

  cost: number = 0;
  dsct: number = 0;
  dias: number = 0;
  final: number = 0;

  email: any;

  direccion : string = '';

  films: any = [];
  rentals: any = [];

  customer: Customer = {
    customer_id: 0,
    store_id: 0,
    first_name: '',
    last_name: '',
    email: '',
    address_id: '',
    active: 0,
    create_date: new Date(),
    last_update: new Date()
  };

  address: Address = {
    address_id: 0,
    address: '',
    address2: '',
    district: '',
    city: '',
    country: '',
    postal_code: '',
    phone: ''
  }

  constructor(private cartService: CartService,
              private customerService: CustomerService,
              private rentalService: RentalService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private location: Location) { }

  ngOnInit(): void {

    const params = this.activatedRoute.snapshot.params;
    if(params.email){
      this.email = params.email;
      console.log(this.email);
    }

    this.getCustomer();
    this.listCart();
  }

  getAddress(customer_id: string){
    this.customerService.getAddress(customer_id).subscribe(
      res => {
        this.address = res;
        console.log(this.address);
      },
      err => console.log(err)
    );
  }

  getCustomer(){
    this.customerService.getCustomerByEmail(this.email).subscribe(
      res => {
        this.customer = res;
        console.log(this.customer);
        if(this.customer.customer_id){
          this.getAddress(this.customer.customer_id.toString());
        }
      },
      err => console.log(err)
    );
  }

  listCart(){
    this.cartService.listCart().subscribe(
      res => {
        this.films = res;
        this.calculatePrice();
        console.log(res);
        console.log(this.cost);
        console.log(this.dsct);
      },
      err => console.log(err)
    );
  }

  calculatePrice(){
    this.cost = 0;
    //this.checkDate();
    console.log(this.dias);
    for(let i = 0; i < this.films.length ; i++){
      this.cost += this.films[i].rental_rate /** this.dias*/;
    }
    this.cost = (Math.round(this.cost * 100) / 100);
    this.calculateDiscount();
    this.calculateFinal();
  }

  calculateDiscount(){
    this.dsct = 0;
    if(this.cost > 10 && this.cost <= 15){
      this.dsct = 10;
    }else if(this.cost > 15 && this.cost <= 20){
      this.dsct = 15;
    }else if(this.cost > 20){
      this.dsct = 20;
    }
  }

  calculateFinal(){
    this.final = this.cost - (this.cost * (this.dsct/100));
  }

  setAddress(address: string | undefined){
    if(address){
      if(address.length > 0){
        this.direccion = address;
      }
    }
  }

  backToCart(){
    this.location.back();
  }

  payCart(){

    for(var i = 0; i < this.films.length; i++){

      var rental : Rental = {
        //rental_date: new Date(),
        inventory_id: this.films[i].inventory_id,
        customer_id: this.customer.customer_id,
        /*return_date: null,*/
        staff_id: 1,
      }

      this.rentals.push(rental);

      this.rentalService.createRental(rental).subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );

      this.cartService.removeFromCart(this.films[i].film_id).subscribe(
        res => {
          console.log(res);
          this.backToCart();
        },
        err => {
          console.log(err);
        }
      ); 
    }

    console.log(this.rentals);

    //console.log('Pagar');
  }
}
