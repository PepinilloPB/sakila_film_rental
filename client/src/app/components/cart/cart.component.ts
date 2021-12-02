import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CartService } from 'src/app/services/cart.service';
import { Customer } from 'src/app/models/Customer';
import { CustomerService } from 'src/app/services/customer.service';
import { Address } from 'src/app/models/Address';
import { Rental } from 'src/app/models/Rental';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  error: boolean = false;
  pay: boolean = false;

  cost: number = 0;
  dsct: number = 0;
  dias: number = 0;
  final: number = 0;

  direccion : string = '';

  start: any | undefined;
  end: any | undefined;

  date_start: string = '';
  date_end: string = '';

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
              private router: Router) { }

  ngOnInit(): void {
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
    this.customerService.getCustomer().subscribe(
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
      this.cost += this.films[i].rental_rate * this.dias;
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

  removeFromCart(id: string){
    this.cartService.removeFromCart(id).subscribe(
      res => {
        this.listCart();
        console.log(res);
      },
      err => {
        this.listCart();
        console.log(err);
      }
    );
  }

  fecha_start : string = '';
  fecha_end : string = '';

  checkDate(){

    this.start = new Date();
    this.end = new Date(this.date_end);

    console.log(this.start.toUTCString());
    console.log(this.end.toUTCString());

    const year_start = this.start.getFullYear();
    var year_end = this.end.getFullYear();

    const month_start = this.start.getMonth() + 1;
    var month_end = this.end.getMonth() + 1;

    const day_start = this.start.getDate();
    var day_end = this.end.getDate();


    this.error = false;
    this.pay = true;
    this.dias = day_end - day_start;
    this.fecha_start = year_start + '-' + month_start + '-' + day_start;
    this.fecha_end = year_end + '-' + month_end + '-' + day_end;
/*
    //En el mismo mes
    if(month_start == month_end){
      //Si la renta esta entre 1 a 7 dias
      if(day_end - day_start <= 7 && day_end - day_start > 0){
        this.error = false;
        this.pay = true;
        this.dias = day_end - day_start;
        this.fecha_start = year_start + '-' + month_start + '-' + day_start;
        this.fecha_end = year_end + '-' + month_end + '-' + day_end;
      //Si la renta no esta entre 1 a 7 dias
      }else{
        this.error = true;
        this.pay = false;
      }
    //Si no son del mismo mes
    }else{
      //Si los meses son diferentes
      if(month_start < month_end){
        //Si el mes es febrero
        if(month_end == 2){
          //Si la renta esta entre 1 a 7 dias
          if(28 - day_start + day_end <= 7 && 28 - day_start + day_end > 0){
            this.error = false;
            this.pay = true;
            this.dias = 28 - day_start + day_end;
            this.fecha_start = year_start + '-' + month_start + '-' + day_start;
            this.fecha_end = year_end + '-' + month_end + '-' + day_end;
          //Si la renta no esta entre 1 a 7 dias
          }else{
            this.error = true;
            this.pay = false;
          }
        //Si es abril, junio, septiembre y noviembre
        }else if(month_end == 4 || month_end == 6 || month_end == 9 || month_end == 11){
          //Si la renta esta entre 1 a 7 dias
          if(30 - day_start + day_end <= 7 && 30 - day_start + day_end > 0){
            this.error = false;
            this.pay = true;
            this.dias = 30 - day_start + day_end;
            this.fecha_start = year_start + '-' + month_start + '-' + day_start;
            this.fecha_end = year_end + '-' + month_end + '-' + day_end;
          //Si la renta no esta entre 1 a 7 dias
          }else{
            this.error = true;
            this.pay = false;
          }
        //Si es enero, marzo, mayo, julio, agosto, octubre y diciembre
        }else if(month_end == 1 || month_end == 3 || month_end == 5 || month_end == 7 ||
                 month_end == 8 || month_end == 10 || month_end == 12){
            //Si la renta esta entre 1 a 7 dias
            if(31 - day_start + day_end <= 7 && 31 - day_start + day_end > 0){
              this.error = false;
              this.pay = true;
              this.dias = 31 - day_start + day_end;
              this.fecha_start = year_start + '-' + month_start + '-' + day_start;
              this.fecha_end = year_end + '-' + month_end + '-' + day_end;
            //Si la renta no esta entre 1 a 7 dias
            }else{
              this.error = true;
              this.pay = false;
            }
          }
      }else{
        this.error = true;
        this.pay = false;
      }
    }*/

    this.calculatePrice();
    this.getCustomer();
  }

  setAddress(address: string | undefined){
    if(address){
      if(address.length > 0){
        this.direccion = address;
      }
    }
  }

  backToCart(){
    this.pay = false;
  }

  payCart(){

    for(var i = 0; i < this.films.length; i++){

      var rental : Rental = {
        rental_date: new Date(),
        inventory_id: this.films[i].inventory_id,
        customer_id: this.customer.customer_id,
        /*return_date: null,*/
        staff_id: 1,
      }

      this.rentals.push(rental);

      this.rentalService.createRental(rental).subscribe(
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
