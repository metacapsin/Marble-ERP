import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeepPaymentListComponent } from './employee-payment-list.component';

describe('EmployeepPaymentListComponent', () => {
  let component: EmployeepPaymentListComponent;
  let fixture: ComponentFixture<EmployeepPaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeepPaymentListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeepPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
