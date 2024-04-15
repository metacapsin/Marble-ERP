import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemographicUpcomingAppointmentsComponent } from './demographic-upcoming-appointments.component';

describe('DemographicUpcomingAppointmentsComponent', () => {
  let component: DemographicUpcomingAppointmentsComponent;
  let fixture: ComponentFixture<DemographicUpcomingAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemographicUpcomingAppointmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemographicUpcomingAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
