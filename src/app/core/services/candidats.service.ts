import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CandidatService {

  constructor(private http: HttpClient) { }

  getAllAnalysedCandidats(): Observable<any> {
    return this.http.get<any>('https://v7sk3jpn45.execute-api.eu-west-3.amazonaws.com/v1/cv-list');
  }

}


