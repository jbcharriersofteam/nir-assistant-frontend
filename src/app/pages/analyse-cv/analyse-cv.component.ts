import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { DetailsCardComponent } from '../../shared/details-card/details-card.component';
import { DetailsCard } from '../../core/models/model';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-analyse-cv',
  standalone: true,
  imports: [CardModule, TagModule, RatingModule, DetailsCardComponent, CommonModule, InputTextModule, FloatLabelModule],
  templateUrl: './analyse-cv.component.html',
  styleUrl: './analyse-cv.component.css'
})
export class AnalyseCvComponent {

  detailsData: DetailsCard[] = [{
    icon: 'pi-thumbs-up',
    title: 'Points forts :',
    subtitle: 'Expérience variée dans différents secteurs (médias, leasing..)',
    length: 6
  },
  {
    icon: 'pi-chart-line',
    title: 'Points d’amélioration :',
    subtitle: 'Renforcer les compétences en dataviz, acquérir des certifications...',
    length: 6
  },
  {
    icon: 'pi-list-check',
    title: 'Recommandations :',
    subtitle: 'Mettre en avant les projets cloud/Data les plus significatifs ...',
    length: 12
  }];

}
