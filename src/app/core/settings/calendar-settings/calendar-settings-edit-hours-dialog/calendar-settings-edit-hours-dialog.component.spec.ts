import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSettingsEditHoursDialogComponent } from './calendar-settings-edit-hours-dialog.component';

describe('CalendarSettingsEditHoursDialogComponent', () => {
  let component: CalendarSettingsEditHoursDialogComponent;
  let fixture: ComponentFixture<CalendarSettingsEditHoursDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarSettingsEditHoursDialogComponent]
    });
    fixture = TestBed.createComponent(CalendarSettingsEditHoursDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
