import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidSalesComponent } from './paid-sales.component';

describe('PaidSalesComponent', () => {
  let component: PaidSalesComponent;
  let fixture: ComponentFixture<PaidSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaidSalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaidSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
