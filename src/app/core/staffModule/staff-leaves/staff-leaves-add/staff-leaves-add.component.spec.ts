import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffLeavesAddComponent } from './staff-leaves-add.component';

describe('StaffLeavesAddComponent', () => {
  let component: StaffLeavesAddComponent;
  let fixture: ComponentFixture<StaffLeavesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffLeavesAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaffLeavesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
