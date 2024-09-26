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
import { NgIf } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { Router } from '@angular/router';
import { CandidatService } from '../../core/services/candidats.service';

@Component({
  selector: 'app-espace-cv',
  standalone: true,
  imports: [CardModule, FileUploadModule, DividerModule, DropdownModule, FormsModule, TableModule, TagModule, IconFieldModule,InputIconModule, InputTextModule, NgIf, TabViewModule ],
  templateUrl: './espace-cv.component.html',
  styleUrl: './espace-cv.component.css'
})
export class EspaceCvComponent implements OnInit {
  cities: City[] | undefined;
  selectedCity: City | undefined;
  data:any;
  customers: any[] = [];
  public analyseService = inject(HttpClient);

  activityValues: number[] = [0, 100];

  router = inject(Router)

  listCandidats: any [] = [];

  constructor(private candidatService: CandidatService) {}

  ngOnInit() {
    this.candidatService.getAllAnalysedCandidats().subscribe(data => this.listCandidats = data)
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    console.log('File selected:', file);

  }

  triggerFileSelect() {
    // Programmatically trigger the file input click
    const fileInputElement = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInputElement) {
      fileInputElement.click();
    }
  }

  redirect(){
    this.router.navigate(['/analyse-cv']);
  }
}

interface City {
  name: string;
  code: string;
}
