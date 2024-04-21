import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidPurchaseComponent } from './paid-purchase.component';

describe('PaidPurchaseComponent', () => {
  let component: PaidPurchaseComponent;
  let fixture: ComponentFixture<PaidPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaidPurchaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaidPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
