import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxVendorEditComponent } from './tax-vendor-edit.component';

describe('TaxVendorEditComponent', () => {
  let component: TaxVendorEditComponent;
  let fixture: ComponentFixture<TaxVendorEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxVendorEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaxVendorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
