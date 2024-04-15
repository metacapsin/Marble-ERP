import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemographicProfileComponent } from './demographic-profile.component';

describe('DemographicProfileComponent', () => {
  let component: DemographicProfileComponent;
  let fixture: ComponentFixture<DemographicProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemographicProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemographicProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
