import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpaidSalesComponent } from './unpaid-sales.component';

describe('UnpaidSalesComponent', () => {
  let component: UnpaidSalesComponent;
  let fixture: ComponentFixture<UnpaidSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnpaidSalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnpaidSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
