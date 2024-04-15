import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemographicPastAppointmentsComponent } from './demographic-past-appointments.component';

describe('DemographicPastAppointmentsComponent', () => {
  let component: DemographicPastAppointmentsComponent;
  let fixture: ComponentFixture<DemographicPastAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemographicPastAppointmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemographicPastAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
