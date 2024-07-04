import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesCreditReportsComponent } from './sales-credit-report.component';

describe('SalesCreditReportsComponent', () => {
  let component: SalesCreditReportsComponent;
  let fixture: ComponentFixture<SalesCreditReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesCreditReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesCreditReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
