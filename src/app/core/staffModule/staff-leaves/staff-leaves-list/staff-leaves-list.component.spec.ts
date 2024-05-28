import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffLeavesListComponent } from './staff-leaves-list.component';

describe('StaffLeavesListComponent', () => {
  let component: StaffLeavesListComponent;
  let fixture: ComponentFixture<StaffLeavesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffLeavesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaffLeavesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
