import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSuppliersComponent } from './edit-suppliers.component';

describe('EditSuppliersComponent', () => {
  let component: EditSuppliersComponent;
  let fixture: ComponentFixture<EditSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSuppliersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
