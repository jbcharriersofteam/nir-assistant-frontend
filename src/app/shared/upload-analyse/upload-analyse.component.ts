import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
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
import { LoadingAnalyseComponent } from '../loading-analyse.component.ts/loading-analyse.component';
import { finalize } from 'rxjs';
import { ResultatAnalyseCvComponent } from '../../pages/analyse-cv/resultat-analyse-cv/resultat-analyse-cv.component';

@Component({
  selector: 'app-upload-analyse',
  standalone: true,
  imports: [CardModule, FileUploadModule, DividerModule, DropdownModule, FormsModule, 
    IconFieldModule, InputIconModule, InputTextModule, NgIf, TabViewModule, DividerModule,
    LoadingAnalyseComponent, ResultatAnalyseCvComponent
  ],
  templateUrl: './upload-analyse.component.html',
  styleUrl: './upload-analyse.component.css'
})
export class UploadAnalyseComponent implements OnInit {

  @ViewChild(LoadingAnalyseComponent) loadingDialog!: LoadingAnalyseComponent;
  @Input() wordings: WordingUpload = {
    title: "",
    subTitle: "",
    section1_title: "",
    section2_title: ""
  }

  selectedFileToUpload: any | null;
  uploadedFile: File | undefined = undefined;
  listToAnalyse: any[] = [];
  selectedFileFromList: any | undefined;
  candidate: any;
  showAnalyse = false;

  constructor(@Inject(AbstractUploadAnalyseFileService) private uploadAnalyseFile: AbstractUploadAnalyseFileService) { }

  ngOnInit() {
    this.uploadAnalyseFile.getFilesList().subscribe(data => { this.listToAnalyse = data })
  }

  uplaodFile() {
    this.uploadAnalyseFile.uploadFile(this.selectedFileToUpload).subscribe({
      next: (data: File) => {
        this.uploadedFile = this.selectedFileToUpload;
        alert("it's ok");
      },
      error: (error) => {
        alert('not OK');
      },
    });
  }

  analyseFile() {
    this.loadingDialog.show();
    this.uploadAnalyseFile.analyseFile(this.selectedFileFromList.Key)
      .pipe(
        finalize(() => {
          this.loadingDialog.hide();
          this.showAnalyse = true;
        })
      ).subscribe({
        next: (result) => {
          this.candidate = result;
          console.log('Analyse terminée avec succès', result);
        },
        error: (error) => {
          console.error("Erreur lors de l'analyse", error);
          this.showAnalyse = false;
        }
      });
  }

  onFileSelect(event: any) {
    this.uploadedFile = undefined;
    this.selectedFileToUpload = event.files[0];
  }

  triggerFileSelect() {
    const fileInputElement = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInputElement) {
      fileInputElement.click();
    }
  }
}
