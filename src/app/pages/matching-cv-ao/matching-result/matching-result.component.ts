import { Component, Input } from '@angular/core';
import { Matching } from '../../../core/models/model';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-matching-result',
  standalone: true,
  imports: [CardModule],
  templateUrl: './matching-result.component.html',
  styleUrl: './matching-result.component.css',
})
export class MatchingResultComponent {
  @Input() matching: Matching | undefined;
}
