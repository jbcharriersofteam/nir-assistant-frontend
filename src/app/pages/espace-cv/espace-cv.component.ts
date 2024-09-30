import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { NgForOf, NgIf } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { Router } from '@angular/router';
import { CandidatService } from '../../core/services/candidats.service';
import { Profil } from '../../core/models/model';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-espace-cv',
  standalone: true,
  imports: [CardModule, NgForOf, FileUploadModule, DividerModule, DropdownModule, FormsModule, TableModule, TagModule, IconFieldModule,InputIconModule, InputTextModule, NgIf, TabViewModule, ToastModule ],
  templateUrl: './espace-cv.component.html',
  styleUrl: './espace-cv.component.css',
})
export class EspaceCvComponent implements OnInit {
  public analyseService = inject(HttpClient);
  router = inject(Router)
  searchValue = '';
  selectedCv: any | undefined;
  listCandidats: any[] = [];
  listCvToAnalyse: Profil[] = [];

  uploadedFile: any | null;

  constructor(private candidatService: CandidatService) {}

  ngOnInit() {
    this.candidatService.getCvList().subscribe(data => { this.listCvToAnalyse = data})
    this.candidatService.getAllAnalysedCandidats().subscribe(data => { this.listCandidats = data; })
  }

  onFileSelect(event: any) {
    this.uploadedFile = null;
    const file = event.files[0];
    this.uploadedFile = file;
  }

  triggerFileSelect() {
    const fileInputElement = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInputElement) {
      fileInputElement.click();
    }
  }

  uplaodFile(){
    this.candidatService.uploadCv(this.uploadedFile).subscribe({
      next: (data) => {
        alert("it's ok")
      },
      error: (error) => {  alert("not OK") }
    }
    )
  }

  test(){
    this.candidatService.analyseCV(this.selectedCv.Key).subscribe(data => console.log(data))
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
