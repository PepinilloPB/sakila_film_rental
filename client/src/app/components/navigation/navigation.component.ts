import { Component, OnInit, HostBinding } from '@angular/core';

import { FilmService } from 'src/app/services/film.service';
import { CartService } from 'src/app/services/cart.service';

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
}
