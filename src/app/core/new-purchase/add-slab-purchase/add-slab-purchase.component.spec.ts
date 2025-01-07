import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSlabPurchaseComponent } from './add-slab-purchase.component';

describe('AddSlabPurchaseComponent', () => {
  let component: AddSlabPurchaseComponent;
  let fixture: ComponentFixture<AddSlabPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSlabPurchaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSlabPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
