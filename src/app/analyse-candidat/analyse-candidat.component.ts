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


@Component({
  selector: 'app-analyse-candidat',
  standalone: true,
  imports: [CardModule, FileUploadModule, DividerModule, DropdownModule, FormsModule, IconFieldModule,InputIconModule, InputTextModule, NgIf, TabViewModule ],
  templateUrl: './analyse-candidat.component.html',
  styleUrl: './analyse-candidat.component.css'
})
export class AnalyseCandidatComponent implements OnInit {

  cities = [];
  selectedCity: any = undefined;
  constructor() {}

  ngOnInit() {
    
  }

  uploadCV(): void {
    // Implement CV upload logic
  }

  selectCV(): void {
    // Implement CV selection logic
  }

  startAnalysis(): void {
    // Implement analysis start logic
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    console.log('File selected:', file);

  }

  triggerFileSelect() {
    const fileInputElement = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInputElement) {
      fileInputElement.click();
    }
  }

 
}
