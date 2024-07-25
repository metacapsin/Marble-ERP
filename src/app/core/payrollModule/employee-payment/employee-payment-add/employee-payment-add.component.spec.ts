import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeepPaymentAddComponent } from './employee-payment-add.component';

describe('EmployeepPaymentAddComponent', () => {
  let component: EmployeepPaymentAddComponent;
  let fixture: ComponentFixture<EmployeepPaymentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeepPaymentAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeepPaymentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
