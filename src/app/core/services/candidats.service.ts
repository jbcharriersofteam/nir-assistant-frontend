import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CandidatService {
  private API: string =
    'https://v7sk3jpn45.execute-api.eu-west-3.amazonaws.com/v1/';

  body: any;
  constructor(private http: HttpClient) {}

  getCvList(): Observable<any> {
    return this.http.get<any>(this.API + 'cv-list');
  }

  uploadCv(data: File): Observable<any> {
    return new Observable((observer) => {
      const reader = new FileReader();

      reader.readAsDataURL(data);

      reader.onload = () => {
        const base64File = reader.result?.toString().split(',')[1];
        const body = {
          file: base64File,
          fileName: data.name,
        };

        this.http.post<any>(this.API + 'upload-cv', body).subscribe(
          (response) => {
            observer.next(response);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      };

      reader.onerror = (error) => {
        observer.error(error);
      };
    });
  }

  getAllAnalysedCandidats(): Observable<any> {
    return this.http.get<any>(this.API + 'scan-cv-table');
  }

  analyseCV(cvName: string) {
    return this.http.get<any>(this.API + 'cv-analyzer?fileName=' + cvName);
  }

}

