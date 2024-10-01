import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Matching } from '../../../core/models/model';
import { MatchingResultComponent } from '../matching-result/matching-result.component';

@Component({
  selector: 'app-matching-result-page',
  standalone: true,
  imports: [MatchingResultComponent],
  templateUrl: './matching-result-page.component.html',
  styleUrl: './matching-result-page.component.css',
})
export class MatchingResultPageComponent {
  matching: Matching | undefined;
  constructor(private router: Router) {
    this.matching = this.router.getCurrentNavigation()?.extras?.state;
    console.log(this.matching);
  }

  ngOnInit(): void {}

  navigateBack() {
    this.router.navigate(['matching-cvao']);
  }
}
