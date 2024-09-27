import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { DetailsCardComponent } from '../../shared/details-card/details-card.component';
import { DetailsCard, Profil } from '../../core/models/model';
import { CommonModule, NgFor } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ResultatAnalyseCvComponent } from './resultat-analyse-cv/resultat-analyse-cv.component';
import { AoCardComponent } from '../../shared/ao-card/ao-card.component';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-analyse-cv',
  standalone: true,
  imports: [
    CardModule,
    TagModule,
    RatingModule,
    DetailsCardComponent,
    CommonModule,
    InputTextModule,
    FloatLabelModule,
    ResultatAnalyseCvComponent,
    AoCardComponent,
  ],
  templateUrl: './analyse-cv.component.html',
  styleUrl: './analyse-cv.component.css',
})
export class AnalyseCvComponent implements OnInit {
  aoCards = [
    {
      title: 'Data Engineering Senior',
      quotation: 90,
      id: 'ANNEXE_2_CAHIER_DES_CHARGES_AT_Data_Engineer_V2.4',
      ref: '736293663',
      client: 'Société Générale',
      sector: 'Bancaire',
      profiles: ['Big Data Engineer', 'Proxy PO Data', 'Data Analyste'],
      startDate: '16/09/2024',
      duration: '3 ans',
    },
    {
      title: 'Data Engineering Senior',
      quotation: 90,
      id: 'ANNEXE_2_CAHIER_DES_CHARGES_AT_Data_Engineer_V2.4',
      ref: '736293663',
      client: 'Société Générale',
      sector: 'Bancaire',
      profiles: ['Big Data Engineer', 'Proxy PO Data', 'Data Analyste'],
      startDate: '16/09/2024',
      duration: '3 ans',
    },
  ];
  candidate: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Profil) => {
      this.candidate = params;
    });
  }
}
