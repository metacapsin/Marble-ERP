import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxVendorsReportsComponent } from './tax-vendors-reports.component';

describe('TaxVendorsReportsComponent', () => {
  let component: TaxVendorsReportsComponent;
  let fixture: ComponentFixture<TaxVendorsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxVendorsReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaxVendorsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
