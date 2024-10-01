import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { CandidatService } from '../../core/services/candidats.service';
import { Profil } from '../../core/models/model';
import { AnalyseCandidatComponent } from '../../analyse-candidat/analyse-candidat.component';
import { Button } from 'primeng/button';

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
    AnalyseCandidatComponent
  ],
  templateUrl: './espace-cv.component.html',
  styleUrl: './espace-cv.component.css',
})
export class EspaceCvComponent implements OnInit {
  public analyseService = inject(HttpClient);
  router = inject(Router);
  searchValue = '';
  listCandidats: any[] = [];

  constructor(private candidatService: CandidatService) {}

  ngOnInit() {
    this.candidatService.getAllAnalysedCandidats().subscribe(data => { this.listCandidats = data; })
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
