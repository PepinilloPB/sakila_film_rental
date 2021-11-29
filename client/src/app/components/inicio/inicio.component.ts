import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Film } from 'src/app/models/Film';
import { FilmService } from 'src/app/services/film.service';
import { CartService } from 'src/app/services/cart.service';

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
    inventory_id: 0
  };

  store_id: number = 0;

  films: any = [];
  premieres: any = [];
  weekly: any = [];
  yearly: any = [];

  constructor(private filmService: FilmService,
              private cartService: CartService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    this.store_id = params.id;
    this.getGames(params.id);
  }

  getGames(store_id: String){
    this.filmService.getFilms(store_id).subscribe(
      res => {
        console.log(res);
        this.films = res;
        this.premieres = this.films[0];
        this.weekly = this.films[1];
        this.yearly = this.films[2];
      },
      err => console.log(err)
    );
  }

  addToCart(id: string){
    this.filmService.getById(id).subscribe(
      res => {
        this.film = res
        console.log(this.film);
        console.log(res);
        this.cartService.addToCart(this.film).subscribe(
          res => {
            console.log(res);
          },
          err => console.log(err));
      },
      err => console.log(err)
    );
  }
}
