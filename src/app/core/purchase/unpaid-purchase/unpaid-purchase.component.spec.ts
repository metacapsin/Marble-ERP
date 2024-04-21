import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpaidPurchaseComponent } from './unpaid-purchase.component';

describe('UnpaidPurchaseComponent', () => {
  let component: UnpaidPurchaseComponent;
  let fixture: ComponentFixture<UnpaidPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnpaidPurchaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnpaidPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
