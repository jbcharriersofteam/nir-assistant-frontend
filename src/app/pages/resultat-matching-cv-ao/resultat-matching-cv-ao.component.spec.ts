import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatMatchingCvAoComponent } from './resultat-matching-cv-ao.component';

describe('ResultatMatchingCvAoComponent', () => {
  let component: ResultatMatchingCvAoComponent;
  let fixture: ComponentFixture<ResultatMatchingCvAoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultatMatchingCvAoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultatMatchingCvAoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
