import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyseCandidatComponent } from './analyse-candidat.component';

describe('AnalyseCandidatComponent', () => {
  let component: AnalyseCandidatComponent;
  let fixture: ComponentFixture<AnalyseCandidatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyseCandidatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyseCandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
