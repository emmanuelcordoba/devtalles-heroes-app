import { Component, OnInit } from '@angular/core';
import { HeroesServices } from "../../services/heroes.services";
import {ActivatedRoute, Router} from "@angular/router";
import {switchMap} from "rxjs";
import {Hero} from "../../interfaces/hero.interface";

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: [
  ]
})
export class HeroPageComponent implements OnInit{

  public hero?: Hero;

  constructor(
    private heroesServices: HeroesServices,
    private acticatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.acticatedRoute.params
      .pipe(
        switchMap(({id}) => this.heroesServices.getHeroById((id)) )
      )
      .subscribe( hero => {
        if(!hero) return this.router.navigate(['/heroes/list']);
        this.hero = hero;
        return;
      })

  }


}
