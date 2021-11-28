import { TestBed } from '@angular/core/testing';

import { CovidcountryService } from './covidcountry.service';

describe('CovidcountryService', () => {
  let service: CovidcountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CovidcountryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
