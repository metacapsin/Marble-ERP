import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTaxVendorsComponent } from './view-tax-vendors.component';

describe('ViewTaxVendorsComponent', () => {
  let component: ViewTaxVendorsComponent;
  let fixture: ComponentFixture<ViewTaxVendorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTaxVendorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewTaxVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
