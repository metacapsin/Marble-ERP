import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffLeavesEditComponent } from './staff-leaves-edit.component';

describe('StaffLeavesEditComponent', () => {
  let component: StaffLeavesEditComponent;
  let fixture: ComponentFixture<StaffLeavesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffLeavesEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaffLeavesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
