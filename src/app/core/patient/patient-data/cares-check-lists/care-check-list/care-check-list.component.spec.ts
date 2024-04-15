import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareCheckListComponent } from './care-check-list.component';

describe('CareCheckListComponent', () => {
  let component: CareCheckListComponent;
  let fixture: ComponentFixture<CareCheckListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareCheckListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CareCheckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
