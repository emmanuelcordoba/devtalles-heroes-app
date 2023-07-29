import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { switchMap } from "rxjs";
import {Hero, Publisher} from "../../interfaces/hero.interface";
import {HeroesServices} from "../../services/heroes.services";
import {ConfirmDialogComponent} from "../../components/confirm-dialog/confirm-dialog.component";

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
    private snackbar: MatSnackBar,
    private dialog: MatDialog
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

  onDeleteHero(): void
  {
    if(!this.currentHero.id) throw Error('Hero id is requiered');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.currentHero,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(!result) return;
      // TODO: Borrar y redireccionar.
    });
  }

  showSnackBar(message: string): void
  {
    this.snackbar.open(message,'Ok', {
      duration: 2500
    })
  }

}
