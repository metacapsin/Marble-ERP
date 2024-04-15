import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAdministeredFormComponent } from './not-administered-form.component';

describe('NotAdministeredFormComponent', () => {
  let component: NotAdministeredFormComponent;
  let fixture: ComponentFixture<NotAdministeredFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotAdministeredFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotAdministeredFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
