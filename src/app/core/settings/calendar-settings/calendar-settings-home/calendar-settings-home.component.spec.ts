import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSettingsHomeComponent } from './calendar-settings-home.component';

describe('CalendarSettingsHomeComponent', () => {
  let component: CalendarSettingsHomeComponent;
  let fixture: ComponentFixture<CalendarSettingsHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarSettingsHomeComponent]
    });
    fixture = TestBed.createComponent(CalendarSettingsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
