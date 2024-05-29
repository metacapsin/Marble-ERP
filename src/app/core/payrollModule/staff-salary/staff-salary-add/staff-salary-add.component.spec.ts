import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffSalaryAddComponent } from './staff-salary-add.component';

describe('StaffSalaryAddComponent', () => {
  let component: StaffSalaryAddComponent;
  let fixture: ComponentFixture<StaffSalaryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffSalaryAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaffSalaryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
