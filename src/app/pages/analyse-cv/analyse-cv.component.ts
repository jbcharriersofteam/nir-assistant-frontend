import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-analyse-cv',
  standalone: true,
  imports: [CardModule, TagModule, RatingModule],
  templateUrl: './analyse-cv.component.html',
  styleUrl: './analyse-cv.component.css'
})
export class AnalyseCvComponent {

}
