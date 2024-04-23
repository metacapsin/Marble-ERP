import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSalesReturnComponent } from './edit-sales-return.component';

describe('EditSalesReturnComponent', () => {
  let component: EditSalesReturnComponent;
  let fixture: ComponentFixture<EditSalesReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSalesReturnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditSalesReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
