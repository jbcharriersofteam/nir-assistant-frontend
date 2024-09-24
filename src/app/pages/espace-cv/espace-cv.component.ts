import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-espace-cv',
  standalone: true,
  imports: [CardModule, FileUploadModule, DividerModule, DropdownModule, FormsModule, TableModule, TagModule],
  templateUrl: './espace-cv.component.html',
  styleUrl: './espace-cv.component.css'
})
export class EspaceCvComponent implements OnInit {
  cities: City[] | undefined;
  selectedCity: City | undefined;

  customers: any[] = [];
  public analyseService = inject(HttpClient);

  activityValues: number[] = [0, 100];

  constructor() {}

  ngOnInit() {

     
      this.customers = [
          { name: 'Amy Elsner', profile: 'amyelsner.png', exp: "4 ans", date: "05/05/2005", tools: "java" },
          { name: 'Amy Elsner', profile: 'amyelsner.png', exp: "4 ans", date: "05/05/2005", tools: "java" },
          { name: 'Amy Elsner', profile: 'amyelsner.png', exp: "4 ans", date: "05/05/2005", tools: "java" },
          { name: 'Amy Elsner', profile: 'amyelsner.png', exp: "4 ans", date: "05/05/2005", tools: "java" },
          { name: 'Amy Elsner', profile: 'amyelsner.png', exp: "4 ans", date: "05/05/2005", tools: "java" },
          { name: 'Amy Elsner', profile: 'amyelsner.png', exp: "4 ans", date: "05/05/2005", tools: "java" },
          { name: 'Amy Elsner', profile: 'amyelsner.png', exp: "4 ans", date: "05/05/2005", tools: "java" },
      ];
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


}


interface City {
  name: string;
  code: string;
}