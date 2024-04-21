import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSalsComponent } from './edit-sals.component';

describe('EditSalsComponent', () => {
  let component: EditSalsComponent;
  let fixture: ComponentFixture<EditSalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditSalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
