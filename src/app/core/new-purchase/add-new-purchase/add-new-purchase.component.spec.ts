import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPurchaseComponent } from './add-new-purchase.component';

describe('AddNewPurchaseComponent', () => {
  let component: AddNewPurchaseComponent;
  let fixture: ComponentFixture<AddNewPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewPurchaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
