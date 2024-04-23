import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSalesReturnComponent } from './all-sales-return.component';

describe('AllSalesReturnComponent', () => {
  let component: AllSalesReturnComponent;
  let fixture: ComponentFixture<AllSalesReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllSalesReturnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllSalesReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
