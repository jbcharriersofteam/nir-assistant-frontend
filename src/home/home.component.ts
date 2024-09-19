import {Component, OnInit} from '@angular/core';
import {CallCVService} from "../services/call-cv.service";
import {Developer} from "../services/developer";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  constructor(private callCVService: CallCVService) {}

  ngOnInit() {
  }

  developer: Developer = {} as Developer;

  getDeveloper() {
    this.callCVService.callDeveloperCv().subscribe(dev => this.developer = dev);
  }
}
