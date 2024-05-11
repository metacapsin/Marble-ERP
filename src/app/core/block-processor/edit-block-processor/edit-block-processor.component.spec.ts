import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBlockProcessorComponent } from './edit-block-processor.component';

describe('EditBlockProcessorComponent', () => {
  let component: EditBlockProcessorComponent;
  let fixture: ComponentFixture<EditBlockProcessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBlockProcessorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditBlockProcessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
