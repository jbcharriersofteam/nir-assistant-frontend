import { TestBed } from '@angular/core/testing';

import { CallCVService } from './call-cv.service';

describe('CallCVService', () => {
  let service: CallCVService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallCVService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
