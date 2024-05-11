import { TestBed } from '@angular/core/testing';

import { BlockProcessorService } from './block-processor.service';

describe('BlockProcessorService', () => {
  let service: BlockProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlockProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
