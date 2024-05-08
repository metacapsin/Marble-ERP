import { TestBed } from '@angular/core/testing';

import { SlabsService } from './slabs.service';

describe('SlabsService', () => {
  let service: SlabsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlabsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
