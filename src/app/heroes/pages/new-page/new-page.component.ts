import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {Hero, Publisher} from "../../interfaces/hero.interface";
import {HeroesServices} from "../../services/heroes.services";
import {switchMap} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit{

  public heroForm = new FormGroup({
    id:               new FormControl<string>(''),
    superhero:        new FormControl<string>('', { nonNullable: true }),
    publisher:        new FormControl<Publisher>(Publisher.DCComics),
    alter_ego:        new FormControl(''),
    first_appearance: new FormControl(''),
    characters:       new FormControl(''),
    alt_img:          new FormControl('')
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  constructor(
    private heroesService: HeroesServices,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  get currentHero(): Hero
  {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    if(!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap(({id}) => this.heroesService.getHeroById(id))
      ).subscribe(hero => {
        if(!hero) return this.router.navigateByUrl('/');
        this.heroForm.reset(hero);
        return;
      })
  }

  onSubmit(): void {
    if(this.heroForm.invalid) return;
    if(this.currentHero.id)
    {
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSnackBar(`${hero.superhero} actualizado.`);
        });
      return;
    }
    this.heroesService.addHero(this.currentHero)
      .subscribe(hero => {
        this.showSnackBar(`${hero.superhero} creado.`);
        this.router.navigate(['/heroes/edit', hero.id])
      });
    return;
  }

  showSnackBar(message: string): void
  {
    this.snackbar.open(message,'Ok', {
      duration: 2500
    })
  }

}
