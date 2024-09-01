import { TestBed } from '@angular/core/testing';

import { TaxVendorsService } from './tax-vendors.service';

describe('TaxVendorsService', () => {
  let service: TaxVendorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxVendorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
