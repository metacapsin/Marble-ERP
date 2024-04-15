import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlosheetsListComponent } from './flowsheets-list.component';

describe('FlosheetsListComponent', () => {
  let component: FlosheetsListComponent;
  let fixture: ComponentFixture<FlosheetsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlosheetsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlosheetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
