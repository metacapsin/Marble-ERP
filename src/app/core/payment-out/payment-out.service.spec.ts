import { TestBed } from '@angular/core/testing';

import { PaymentInService } from './payment-in.service';

describe('PaymentInService', () => {
  let service: PaymentInService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentInService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
