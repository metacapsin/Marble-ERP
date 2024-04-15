import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmunizationsListComponent } from './immunizations-list.component';

describe('ImmunizationsListComponent', () => {
  let component: ImmunizationsListComponent;
  let fixture: ComponentFixture<ImmunizationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImmunizationsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImmunizationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
