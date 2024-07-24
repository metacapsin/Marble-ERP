import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStaffDesignationComponent } from './edit-staff-designation.component';

describe('EditStaffDesignationComponent', () => {
  let component: EditStaffDesignationComponent;
  let fixture: ComponentFixture<EditStaffDesignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStaffDesignationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditStaffDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
