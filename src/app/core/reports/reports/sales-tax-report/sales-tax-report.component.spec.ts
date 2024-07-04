import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesTaxReportsComponent } from './sales-tax-report.component';

describe('SalesTaxReportsComponent', () => {
  let component: SalesTaxReportsComponent;
  let fixture: ComponentFixture<SalesTaxReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesTaxReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesTaxReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
