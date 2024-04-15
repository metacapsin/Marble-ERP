import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemographicAdditionalInfoComponent } from './demographic-additional-info.component';

describe('DemographicAdditionalInfoComponent', () => {
  let component: DemographicAdditionalInfoComponent;
  let fixture: ComponentFixture<DemographicAdditionalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemographicAdditionalInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemographicAdditionalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
