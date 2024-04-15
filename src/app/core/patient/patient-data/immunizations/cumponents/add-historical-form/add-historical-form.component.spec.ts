import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHistoricalFormComponent } from './add-historical-form.component';

describe('AddHistoricalFormComponent', () => {
  let component: AddHistoricalFormComponent;
  let fixture: ComponentFixture<AddHistoricalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHistoricalFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddHistoricalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
