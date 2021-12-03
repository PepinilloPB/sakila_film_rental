import { Component, OnInit, HostBinding } from '@angular/core';

import { FilmService } from 'src/app/services/film.service';
import { CartService } from 'src/app/services/cart.service';

import { Film } from 'src/app/models/Film';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  @HostBinding('class') classes = 'row';

  busqueda: boolean = false;
  login: boolean = false;

  search: string = '';

  films: any = [];
  cart: any = [];

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

  constructor(private filmService: FilmService,
              private cartService: CartService) { }

  ngOnInit(): void {}

  askForLogin(){
    this.login = true;
  }

  listCart(){
    this.cartService.listCart().subscribe(
      res => {
        this.cart = res;
        console.log(res);
      },
      err => console.log(err)
    );
  }

  buscar_pelicula_titulo(){
    if(this.search.length > 0){
      this.busqueda = true;
      this.filmService.getByTitle(this.search).subscribe(
        res => {
          console.log(res);
          this.films = res;
        },
        err => console.log(err)
      );
    }else{
      this.busqueda = false;
    }
  }

  buscar_pelicula_actor(){
    if(this.search.length > 0){
      this.busqueda = true;
      this.filmService.getByActor(this.search).subscribe(
        res => {
          console.log(res);
          this.films = res;
        },
        err => console.log(err)
      );
    }else{
      this.busqueda = false;
    }
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

      for(var j = 0; j < this.films.length; j++){
        for(var k = 0; k < this.cart.length; k++){
          console.log('En compareFilms ' + this.cart.length);
          console.log(this.cart);
          if(this.films[j].film_id === this.cart[k].film_id){
            this.films[j].in_cart = true;
          }
        }
      }
    

    //this.listCart();
  }
}
