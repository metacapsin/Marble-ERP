import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemographicPatientPortalComponent } from './demographic-patient-portal.component';

describe('DemographicPatientPortalComponent', () => {
  let component: DemographicPatientPortalComponent;
  let fixture: ComponentFixture<DemographicPatientPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemographicPatientPortalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemographicPatientPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
