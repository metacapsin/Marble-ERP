import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidPurchaseReturnComponent } from './paid-purchase-return.component';

describe('PaidPurchaseReturnComponent', () => {
  let component: PaidPurchaseReturnComponent;
  let fixture: ComponentFixture<PaidPurchaseReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaidPurchaseReturnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaidPurchaseReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
