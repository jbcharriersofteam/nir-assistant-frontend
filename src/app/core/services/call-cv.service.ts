import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {Developer} from "./developer";

@Injectable({
  providedIn: "root"
})
export class CallCVService {

  constructor(private http: HttpClient) { }

  callDeveloperCv(): Observable<Developer> {
    return this.http.get<Developer>('https://kckwuprse9.execute-api.eu-west-3.amazonaws.com/v1/cv-analyzer');
  }
}


