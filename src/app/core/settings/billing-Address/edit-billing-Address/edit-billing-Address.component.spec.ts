import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBillingAddressComponent } from './edit-billing-Address.component';

describe('EditBillingAddressComponent', () => {
  let component: EditBillingAddressComponent;
  let fixture: ComponentFixture<EditBillingAddressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditBillingAddressComponent]
    });
    fixture = TestBed.createComponent(EditBillingAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
