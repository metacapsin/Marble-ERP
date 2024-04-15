import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddImmunizationsComponent } from './add-immunizations.component';

describe('AddImmunizationsComponent', () => {
  let component: AddImmunizationsComponent;
  let fixture: ComponentFixture<AddImmunizationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddImmunizationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddImmunizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
