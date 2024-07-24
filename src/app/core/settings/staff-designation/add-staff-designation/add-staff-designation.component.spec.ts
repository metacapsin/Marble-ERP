import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStaffDesignationComponent } from './add-staff-designation.component';

describe('AddStaffDesignationComponent', () => {
  let component: AddStaffDesignationComponent;
  let fixture: ComponentFixture<AddStaffDesignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStaffDesignationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddStaffDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
