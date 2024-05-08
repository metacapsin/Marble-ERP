import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBlockCustomerComponent } from './add-block-customer.component';

describe('AddBlockCustomerComponent', () => {
  let component: AddBlockCustomerComponent;
  let fixture: ComponentFixture<AddBlockCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBlockCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddBlockCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
