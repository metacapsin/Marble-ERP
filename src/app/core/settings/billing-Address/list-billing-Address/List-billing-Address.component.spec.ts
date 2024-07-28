import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBillingAddressComponent } from './List-billing-Address.component';

describe('ListBillingAddressComponent', () => {
  let component: ListBillingAddressComponent;
  let fixture: ComponentFixture<ListBillingAddressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListBillingAddressComponent]
    });
    fixture = TestBed.createComponent(ListBillingAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});