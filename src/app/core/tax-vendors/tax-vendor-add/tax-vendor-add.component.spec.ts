import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxVendorAddComponent } from './tax-vendor-add.component';

describe('TaxVendorAddComponent', () => {
  let component: TaxVendorAddComponent;
  let fixture: ComponentFixture<TaxVendorAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxVendorAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaxVendorAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
