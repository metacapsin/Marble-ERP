import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPracticeComponent } from './edit-practice.component';

describe('EditPracticeComponent', () => {
  let component: EditPracticeComponent;
  let fixture: ComponentFixture<EditPracticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPracticeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
