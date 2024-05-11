import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockProcessorListComponent } from './block-processor-list.component';

describe('BlockProcessorListComponent', () => {
  let component: BlockProcessorListComponent;
  let fixture: ComponentFixture<BlockProcessorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockProcessorListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlockProcessorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
