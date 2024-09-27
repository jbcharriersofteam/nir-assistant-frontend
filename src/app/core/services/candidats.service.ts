import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CandidatService {

  private API: string = "https://v7sk3jpn45.execute-api.eu-west-3.amazonaws.com/v1/"

  constructor(private http: HttpClient) { }

  getCvList(): Observable<any> {
    return this.http.get<any>(this.API + 'cv-list');
  }
  uploadCv( data: any){
    return this.http.post<any>(this.API + 'upload-cv', data, {});
  }
  getAllAnalysedCandidats(): Observable<any> {
    return this.http.get<any>(this.API + 'scan-cv-table');
  }
}


