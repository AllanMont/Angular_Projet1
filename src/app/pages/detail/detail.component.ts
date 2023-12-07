import { Component, OnDestroy, OnInit } from '@angular/core';
import { IOlympicCountry } from 'src/app/core/models/Olympic.model';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Subject, Observable, of, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ISubTitle } from 'src/app/core/models/subTitle.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy{

  public olympics$: Observable<IOlympicCountry[] | undefined> = of(undefined);
  private unsubscribe$ = new Subject<void>();
  public  = false;

  public view:[number, number] = [700, 500];

  public countryName = '';
  public subTitles: ISubTitle[] = [];
  public countryData: {name: string, series: {name: string, value: number}[]}[] = [];

  constructor(
    private olympicService: OlympicService, 
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.view = [innerWidth/1.3, 500];
  }

  /**
   * Appelé lors de l'initialisation du composant.
   * Récupère les données olympiques, les traite et met à jour les propriétés du composant en conséquence.
   */
  ngOnInit(): void {
    this.countryName = this.activatedRoute.snapshot.paramMap.get('countryName') ?? '';

    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: IOlympicCountry[] | undefined) => {
        if (data) {
          const filteredData = data.filter(data => data.country === this.countryName);
          const isCountry = filteredData.length > 0;
          if (!isCountry) {
            return this.router.navigate(['/notFound']);
          }
          this.countryData = [{
            name: this.countryName, 
            series: filteredData[0].participations.map(participation => {
              return {name: participation.year.toString(), value: participation.medalsCount};
            })
          }];
          this.subTitles = [
            {name: 'Number of entries', value: filteredData[0].participations.length },
            {name: 'Total number medals', value: filteredData[0].participations.map(participation => participation.medalsCount).reduce( (acc, curr) => acc + curr) },
            {name: 'Total number of athletes', value: filteredData[0].participations.map(participation => participation.athleteCount).reduce( (acc, curr) => acc + curr)  } ];
        } 
      });
  }

  /**
   * Appelé lors du redimensionnement de la fenêtre.
   * Met à jour la taille du graphique en conséquence.
   */
  onResize(event: UIEvent) {
    const window = event.target as Window; 
    this.view = [window.innerWidth , 500];
  }
  
  /**
   * Appelé lors du clic sur le bouton de retour.
   * Redirige vers la page d'accueil.
   */
  back() { 
    this.router.navigate(['/']);
  }

  /**
   * Appelé lors de la destruction du composant.
   * Détruit le Subject unsubscribe$.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
