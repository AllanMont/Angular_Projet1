import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { IOlympicCountry } from 'src/app/core/models/Olympic.model';
import { Router } from '@angular/router';
import { ISubTitle } from 'src/app/core/models/subTitle.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private olympics$: Observable<IOlympicCountry[] | undefined> = of(undefined);
  public subTitles: ISubTitle[] = [];
  private unsubscribe$ = new Subject<void>();
  public asyncFlag = false;

  public view:[number, number] = [500, 500];
  public data : {name:string, value: number}[] = [];
  public gradient = false;
  public showLegend = false;
  public showLabels = true;
  public isDoughnut = false;

  constructor(private olympicService: OlympicService, private router: Router) {
    this.view = [innerWidth / 1.1, 600];
  }


  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: IOlympicCountry[] | undefined) => {
        if (data) {
          let infoJOs: { year: number; city: string; }[] = [];
          data.forEach((country: IOlympicCountry) => {
            console.log(country)
            let numberOfMedals = 0
            country?.participations.forEach(participations => {
              numberOfMedals += participations.medalsCount;
              // Vérification si l'année est déjà présente dans le tableau
              if(!infoJOs.some(infoJO => infoJO.year === participations.year)){
                infoJOs.push({year : participations.year, city: participations.city})
              }
            });
            this.data.push({name: country.country, value: numberOfMedals}); 
          }
          );
          this.subTitles = [{name: 'Number of JOs', value: infoJOs.length },{ name: 'Number of countries', value: data.length} ];
          this.asyncFlag = true;
        }
      });
  }

  onSelect(event:{name:string}): void {
    this.router.navigate([`./detail/${event.name}`]);
  }

  onResize(event: UIEvent) {
    const w = event.target as Window; 
    this.view = [w.innerWidth / 1.30, 500];
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  
}
