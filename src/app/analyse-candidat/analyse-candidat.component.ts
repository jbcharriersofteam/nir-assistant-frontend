import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { CandidatService } from '../core/services/candidats.service';
import { Profil } from '../core/models/model';


@Component({
  selector: 'app-analyse-candidat',
  standalone: true,
  imports: [CardModule, FileUploadModule, DividerModule, DropdownModule, FormsModule, IconFieldModule,InputIconModule, InputTextModule, NgIf, TabViewModule, DividerModule ],
  templateUrl: './analyse-candidat.component.html',
  styleUrl: './analyse-candidat.component.css'
})
export class AnalyseCandidatComponent implements OnInit {

  cities = [];
  selectedCity: any = undefined;
  uploadedFile: any | null;
  listCvToAnalyse: Profil[] = [];
  selectedCv: any | undefined;

  constructor(private candidatService: CandidatService) {}

  ngOnInit() {
    this.candidatService.getCvList().subscribe(data => { this.listCvToAnalyse = data})
  }
  analyseFile() {  }

  uplaodFile() {
    this.candidatService.uploadCv(this.uploadedFile).subscribe({
      next: (data) => {
        alert("it's ok");
      },
      error: (error) => {
        alert('not OK');
      },
    });
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
}
