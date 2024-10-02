import { Component, Input, OnInit } from '@angular/core';
import { DetailsCard, Matching } from '../../../core/models/model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { DetailsCardComponent } from '../../../shared/details-card/details-card.component';

@Component({
  selector: 'app-matching-result',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    TagModule,
    CommonModule,
    DividerModule,
    DetailsCardComponent,
  ],
  templateUrl: './matching-result.component.html',
  styleUrl: './matching-result.component.css',
})
export class MatchingResultComponent implements OnInit {
  @Input() matching: Matching | undefined;
  justifications: DetailsCard | any;
  recommandations: DetailsCard | any;

  ngOnInit(): void {
    if (this.matching?.justifications) {
      this.justifications = {
        icon: 'pi pi-exclamation-circle',
        title: 'Compte-rendu',
        subtitle: this.matching.justifications,
      };
    }
    if (this.matching?.recommandations) {
      this.recommandations = {
        icon: 'pi pi-exclamation-circle',
        title: 'Recommandations',
        subtitle: this.matching.recommandations,
      };
    }
  }
}
