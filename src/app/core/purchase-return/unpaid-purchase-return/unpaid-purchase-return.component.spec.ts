import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpaidPurchaseReturnComponent } from './unpaid-purchase-return.component';

describe('UnpaidPurchaseReturnComponent', () => {
  let component: UnpaidPurchaseReturnComponent;
  let fixture: ComponentFixture<UnpaidPurchaseReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnpaidPurchaseReturnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnpaidPurchaseReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
