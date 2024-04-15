import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemographicContactsComponent } from './demographic-contacts.component';

describe('DemographicContactsComponent', () => {
  let component: DemographicContactsComponent;
  let fixture: ComponentFixture<DemographicContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemographicContactsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemographicContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
