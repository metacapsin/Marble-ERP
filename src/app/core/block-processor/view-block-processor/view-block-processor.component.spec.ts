import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBlockProcessorComponent } from './view-block-processor.component';

describe('ViewBlockProcessorComponent', () => {
  let component: ViewBlockProcessorComponent;
  let fixture: ComponentFixture<ViewBlockProcessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBlockProcessorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewBlockProcessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
