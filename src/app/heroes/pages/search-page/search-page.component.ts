import { Component } from '@angular/core';
import {FormControl} from "@angular/forms";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";

import {Hero} from "../../interfaces/hero.interface";
import {HeroesServices} from "../../services/heroes.services";

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: [
  ]
})
export class SearchPageComponent {

  public searchInput = new FormControl();
  public heroes: Hero[] = [];
  public heroeSelected?: Hero;

  constructor(
    private heroesServices: HeroesServices
  ) {
  }

  searchHero()
  {
    const value: string = this.searchInput.value  || '';
    this.heroesServices.getSuggestions(value)
      .subscribe(heroes => this.heroes = heroes);

  }

  onSelectedOption(event: MatAutocompleteSelectedEvent): void
  {
    if(!event.option.value)
    {
      this.heroeSelected = undefined;
      return;
    }
    const hero: Hero = event.option.value;
    this.searchInput.setValue(hero.superhero);
    this.heroeSelected = hero;
  }

}
