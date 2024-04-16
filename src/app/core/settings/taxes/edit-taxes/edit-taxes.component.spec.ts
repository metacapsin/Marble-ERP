import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTaxesComponent } from './edit-taxes.component';

describe('EditTaxesComponent', () => {
  let component: EditTaxesComponent;
  let fixture: ComponentFixture<EditTaxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTaxesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditTaxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
