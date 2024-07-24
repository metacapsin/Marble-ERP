import { TestBed } from '@angular/core/testing';

import { StaffDesignationService } from './staff-designation.service';

describe('StaffDesignationService', () => {
  let service: StaffDesignationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaffDesignationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
