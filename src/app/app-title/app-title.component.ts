import { Component, Input } from '@angular/core';
import { ISubTitle } from 'src/app/core/models/subTitle.model';

@Component({
  selector: 'app-app-title',
  templateUrl: './app-title.component.html',
  styleUrls: ['./app-title.component.scss']
})
export class AppTitleComponent {

  @Input() title = 'Default title';
  @Input() subTitles: ISubTitle[] = [];

}
