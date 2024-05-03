import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInAddComponent } from './payment-in-add.component';

describe('PaymentInAddComponent', () => {
  let component: PaymentInAddComponent;
  let fixture: ComponentFixture<PaymentInAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentInAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentInAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
