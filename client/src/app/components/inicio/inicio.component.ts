import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Film } from 'src/app/models/Film';
import { FilmService } from 'src/app/services/film.service';
import { CartService } from 'src/app/services/cart.service';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  @HostBinding('class') classes = 'row';
  
  film: Film = {
    film_id: 0,
    title: '',
    description: '',
    release_year: 0,
    language: '',
    original_language: '',
    rental_duration: 0,
    rental_rate: 0,
    length: 0,
    replacement_cost: 0,
    rating: '',
    special_features: '',
    last_update: new Date(),
    inventory_id: 0,
    available: 0,
    in_cart: false
  };

  store_id: number = 0;

  films: any = [];
  cart: any = [];
  premieres: any = [];
  weekly: any = [];
  yearly: any = [];

  pending: boolean = false;

  constructor(private filmService: FilmService,
              private cartService: CartService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;

    if(this.router.url === '/inicio/' + params.id){
      this.getGames(params.id);
      this.pending = false;
    }else if (this.router.url === '/pending/' + params.id){
      this.getPending(params.id);
      this.pending = true;
    }

    this.listCart();
    console.log('Al iniciar: ');
    console.log(this.cart);
    //this.compareFilms();
  }

  listCart(){
    this.cartService.listCart().subscribe(
      res => {
        this.cart = res;
        console.log('Al listar: ');
        console.log(this.cart);
        this.compareFilms();
      },
      err => console.log(err)
    );
  }

  getGames(store_id: String){
    this.filmService.getFilms(store_id).subscribe(
      res => {
        //console.log(res);
        this.films = res;
        this.premieres = this.films[0];
        this.weekly = this.films[1];
        this.yearly = this.films[2];
        this.listCart();
      },
      err => console.log(err)
    );
  }

  getPending(store_id: String){
    this.filmService.getPendingFilms(store_id).subscribe(
      res => {
        //console.log(res);
        this.premieres = res;
        this.weekly = [];
        this.yearly = [];
      },
      err => console.log(err)
    );
  }

  addToCart(id: string){
    this.filmService.getById(id).subscribe(
      res => {
        this.film = res
        this.cart.push(this.film);
        //console.log(this.cart);
        //console.log(res);
        this.cartService.addToCart(this.film).subscribe(
          res => {
            //console.log(res);
            this.compareFilms();
            /*for(var i = 0; i < this.films.length; i++){
              for(var j = 0; j < this.films[i].length; j++){
                for(var k = 0; k < this.cart.length; k++){
                  if(this.films[i][j].film_id == this.cart[k].film_id){
                    this.films[i][j].in_cart = true;
                  }
                }
              }
            }*/
          },
          err => console.log(err));
      },
      err => console.log(err)
    );
  }

  compareFilms(){

    console.log('Al comparar: ');
    console.log(this.cart);

    for(var i = 0; i < this.films.length; i++){
      for(var j = 0; j < this.films[i].length; j++){
        for(var k = 0; k < this.cart.length; k++){
          console.log('En compareFilms ' + this.cart.length);
          console.log(this.cart);
          if(this.films[i][j].film_id === this.cart[k].film_id){
            this.films[i][j].in_cart = true;
          }
        }
      }
    }

    //this.listCart();
  }
}
