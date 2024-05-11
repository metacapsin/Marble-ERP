import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBlockProcessorComponent } from './add-block-processor.component';

describe('AddBlockProcessorComponent', () => {
  let component: AddBlockProcessorComponent;
  let fixture: ComponentFixture<AddBlockProcessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBlockProcessorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddBlockProcessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
