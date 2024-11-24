import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNewPurchaseComponent } from './edit-new-purchase.component';

describe('EditNewPurchaseComponent', () => {
  let component: EditNewPurchaseComponent;
  let fixture: ComponentFixture<EditNewPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditNewPurchaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditNewPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
