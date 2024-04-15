import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongTermCareFacilityComponent } from './long-term-care-facility.component';

describe('LongTermCareFacilityComponent', () => {
  let component: LongTermCareFacilityComponent;
  let fixture: ComponentFixture<LongTermCareFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LongTermCareFacilityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LongTermCareFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
