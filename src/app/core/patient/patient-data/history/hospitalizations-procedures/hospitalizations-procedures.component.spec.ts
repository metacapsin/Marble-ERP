import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalizationsProceduresComponent } from './hospitalizations-procedures.component';

describe('HospitalizationsProceduresComponent', () => {
  let component: HospitalizationsProceduresComponent;
  let fixture: ComponentFixture<HospitalizationsProceduresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalizationsProceduresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HospitalizationsProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
