import { Component, Inject, Input, OnInit } from '@angular/core';
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
import { AbstractUploadAnalyseFileService } from '../../core/services/upload-analyse-file';
import { WordingUpload } from '../../core/models/model';

@Component({
  selector: 'app-upload-analyse',
  standalone: true,
  imports: [CardModule, FileUploadModule, DividerModule, DropdownModule, FormsModule, IconFieldModule,InputIconModule, InputTextModule, NgIf, TabViewModule, DividerModule ],
  templateUrl: './upload-analyse.component.html',
  styleUrl: './upload-analyse.component.css'
})
export class UploadAnalyseComponent implements OnInit {

  uploadedFile: any | null;
  listToAnalyse: any[] = [];
  selectedFile: any | undefined;
  @Input() wordings : WordingUpload = {
    title: "",
    subTitle: "",
    section1_title: "",
    section2_title: ""
  }

  constructor(@Inject(AbstractUploadAnalyseFileService) private uploadAnalyseFile: AbstractUploadAnalyseFileService) {}

  ngOnInit() {
    this.uploadAnalyseFile.getFilesList().subscribe(data => { this.listToAnalyse = data})
  }
  analyseFile() {  }

  uplaodFile() {
    this.uploadAnalyseFile.uploadFile(this.uploadedFile).subscribe({
      next: (data) => {
        alert("it's ok");
      },
      error: (error) => {
        alert('not OK');
      },
    });
  }

  analyseCv(){
    this.uploadAnalyseFile.analyseFile("").subscribe();
  }

  onFileSelect(event: any) {
    this.uploadedFile = null;
    this.uploadedFile = event.files[0];
  }

  triggerFileSelect() {
    const fileInputElement = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInputElement) {
      fileInputElement.click();
    }
  }
}
