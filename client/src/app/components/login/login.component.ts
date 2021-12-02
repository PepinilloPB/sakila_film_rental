import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/Customer';
import { CustomerService } from 'src/app/services/customer.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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


  email: any;

  store_id: number = 0;

  constructor(private customerService: CustomerService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    //console.log(this.router.url);
    if(this.router.url.includes('inicio')){
      console.log('Si es inicio');
      const params = this.activatedRoute.snapshot.params;
      if(params.id){
        this.store_id = params.id;
      }
    }
  }

  getCustomer(){
    console.log(this.email);
    this.customerService.getCustomerByEmail(this.email).subscribe(
      res => {
        this.customer = res;
        console.log(this.customer);
        console.log(this.router.url);

        if(this.router.url.includes('inicio')){
          console.log('En inicio');
          this.router.navigate(['pending/' + this.store_id]);
        }else if(this.router.url === '/cart'){
          console.log('En cart');
          this.router.navigate(['payment/' + this.customer.email]);
        }
      },
      err => console.log(err)
    );
  }
}
