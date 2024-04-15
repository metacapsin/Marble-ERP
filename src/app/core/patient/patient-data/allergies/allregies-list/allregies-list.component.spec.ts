import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllregiesListComponent } from './allregies-list.component';

describe('AllregiesListComponent', () => {
  let component: AllregiesListComponent;
  let fixture: ComponentFixture<AllregiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllregiesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllregiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
