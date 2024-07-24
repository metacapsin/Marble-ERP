import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStaffDesignationComponent } from './list-staff-designation.component';

describe('ListStaffDesignationComponent', () => {
  let component: ListStaffDesignationComponent;
  let fixture: ComponentFixture<ListStaffDesignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListStaffDesignationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListStaffDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
