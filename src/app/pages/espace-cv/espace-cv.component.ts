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
import { AnalyseCandidatService } from '../../core/services/analyse-cv.service';
import { UploadAnalyseComponent } from '../../shared/upload-analyse/upload-analyse.component';

@Component({
  selector: 'app-espace-cv',
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
  templateUrl: './espace-cv.component.html',
  styleUrl: './espace-cv.component.css',
  providers: [
    { provide: AbstractUploadAnalyseFileService, useClass: AnalyseCandidatService }
  ]
})
export class EspaceCvComponent implements OnInit {
  public analyseService = inject(HttpClient);
  router = inject(Router);
  searchValue = '';
  listCandidats: any[] = [];
  wordings: WordingUpload = {
    title: "Analyser les données du candidat",
    subTitle: "Téléchargez ou sélectionnez le CV du candidat que vous souhaitez analyser",
    section1_title: "Télécharger un CV",
    section2_title: "Sélectionner un CV"
  }

  constructor(private analyseCandidatService: AnalyseCandidatService) {}

  ngOnInit() {
    this.analyseCandidatService.getAllAnalysedCandidats().subscribe(data => { this.listCandidats = data; })
  }

  globalSearch(dt: any, event: any) {
    return dt.filterGlobal(event.target.value, 'contains');
  }

  redirect(profil: Profil) {
    profil.metier_fonc = profil.metier_fonc
      ? profil.metier_fonc
      : [];
    profil.experience = profil.experience
      ? profil.experience.match(/[0-9]+/g)?.[0]
      : undefined;
    profil.attractivite = profil.attractivite
      ? profil.attractivite.match(/[0-9]+/g)?.[0]
      : '0';
    profil.techno_majeures = profil.techno_majeures
      ? profil.techno_majeures
      : [];
    profil.techno_mineures = profil.techno_mineures
      ? profil.techno_mineures
      : [];
    this.router.navigate(['/analyse-cv'], { state: profil });
  }
}
