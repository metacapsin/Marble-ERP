import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBlockCustomerComponent } from './edit-block-customer.component';

describe('EditBlockCustomerComponent', () => {
  let component: EditBlockCustomerComponent;
  let fixture: ComponentFixture<EditBlockCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBlockCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditBlockCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
