import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastMedicalHistoryEditComponent } from './past-medical-history-edit.component';

describe('PastMedicalHistoryEditComponent', () => {
  let component: PastMedicalHistoryEditComponent;
  let fixture: ComponentFixture<PastMedicalHistoryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastMedicalHistoryEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PastMedicalHistoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
