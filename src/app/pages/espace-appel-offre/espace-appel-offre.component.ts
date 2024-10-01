import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Profil, WordingUpload } from '../../core/models/model';
import { Button } from 'primeng/button';
import { AbstractUploadAnalyseFileService } from '../../core/services/upload-analyse-file';
import { UploadAnalyseComponent } from '../../shared/upload-analyse/upload-analyse.component';
import { AoService } from '../../core/services/ao.service';

@Component({
  selector: 'app-espace-appel-offre',
  standalone: true,
  imports: [
    CardModule,
    NgForOf,
    FormsModule,
    TableModule,
    TagModule,
    InputTextModule,
    Button,
    NgIf,
    UploadAnalyseComponent,
  ],
  templateUrl: './espace-appel-offre.component.html',
  styleUrl: './espace-appel-offre.component.css',
  providers: [
    { provide: AbstractUploadAnalyseFileService, useClass: AoService }
  ]
})
export class EspaceAppelOffreComponent implements OnInit {
  public analyseService = inject(HttpClient);
  router = inject(Router);
  searchValue = '';
  listAO: any[] = [];
  wordings: WordingUpload = {
    title: "Analyser un appel d'offres (AO)",
    subTitle: "Téléchargez ou sélectionnez dans la liste le document d’AO que vous souhaitez analyser",
    section1_title: "Télécharger un appel d'offres",
    section2_title: "Sélectionner un appel d'offres"
  }

  constructor(private ao: AoService) { }

  ngOnInit() {
    this.ao.getAllAnalysedAos().subscribe((data: any) => { this.listAO = data; })
  }

  globalSearch(dt: any, event: any) {
    return dt.filterGlobal(event.target.value, 'contains');
  }

  redirect(profil: Profil) {
    profil.metier_fonc = profil.metier_fonc
      ? profil.metier_fonc.split(',')
      : [];
    profil.experience = profil.experience
      ? profil.experience.match(/[0-9]+/g)?.[0]
      : undefined;
    profil.attractivite = profil.attractivite
      ? profil.attractivite.match(/[0-9]+/g)?.[0]
      : '0';
    profil.techno_majeures = profil.techno_majeures
      ? profil.techno_majeures.split(',')
      : [];
    profil.techno_mineures = profil.techno_mineures
      ? profil.techno_mineures.split(',')
      : [];
    console.log(profil);
    this.router.navigate(['/analyse-cv'], { state: profil });
  }
}
