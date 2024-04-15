import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospiceComponent } from './hospice.component';

describe('HospiceComponent', () => {
  let component: HospiceComponent;
  let fixture: ComponentFixture<HospiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HospiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
