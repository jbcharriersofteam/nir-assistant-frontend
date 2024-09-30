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

  uploadCv(data: any) {
    const reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onload = () => {
      const base64File = reader.result?.toString().split(',')[1];
      this.body = {
        file: base64File,
        fileName: data.name,
      };
      console.log(this.body);
    };
    return this.http.post<any>(this.API + 'upload-cv', this.body);
  }

  getAllAnalysedCandidats(): Observable<any> {
    return this.http.get<any>(this.API + 'scan-cv-table');
  }
}
