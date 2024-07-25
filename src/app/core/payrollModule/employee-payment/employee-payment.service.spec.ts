import { TestBed } from '@angular/core/testing';

import { EmployeepPaymentService } from './employee-payment.service';

describe('EmployeepPaymentService', () => {
  let service: EmployeepPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeepPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
