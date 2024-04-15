import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataManagementAddDialogComponent } from './data-management-add-dialog.component';

describe('DataManagementAddDialogComponent', () => {
  let component: DataManagementAddDialogComponent;
  let fixture: ComponentFixture<DataManagementAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataManagementAddDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataManagementAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
