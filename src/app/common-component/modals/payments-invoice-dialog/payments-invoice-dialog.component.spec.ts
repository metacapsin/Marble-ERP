import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsInvoiceDialogComponent } from './payments-invoice-dialog.component';

describe('PaymentsInvoiceDialogComponent', () => {
  let component: PaymentsInvoiceDialogComponent;
  let fixture: ComponentFixture<PaymentsInvoiceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsInvoiceDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentsInvoiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
