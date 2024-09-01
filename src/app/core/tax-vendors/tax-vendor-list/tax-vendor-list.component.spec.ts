import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxVendorListComponent } from './tax-vendor-list.component';

describe('TaxVendorListComponent', () => {
  let component: TaxVendorListComponent;
  let fixture: ComponentFixture<TaxVendorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxVendorListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaxVendorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
