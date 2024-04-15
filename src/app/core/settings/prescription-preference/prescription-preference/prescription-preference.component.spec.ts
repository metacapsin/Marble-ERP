import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionPreferenceComponent } from './prescription-preference.component';

describe('PrescriptionPreferenceComponent', () => {
  let component: PrescriptionPreferenceComponent;
  let fixture: ComponentFixture<PrescriptionPreferenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionPreferenceComponent]
    });
    fixture = TestBed.createComponent(PrescriptionPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
