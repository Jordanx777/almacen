import { TestBed } from '@angular/core/testing';

import { ComisionServiceService } from './comision-service.service';

describe('ComisionServiceService', () => {
  let service: ComisionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComisionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
