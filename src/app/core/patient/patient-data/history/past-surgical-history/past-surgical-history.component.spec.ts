import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastSurgicalHistoryComponent } from './past-surgical-history.component';

describe('PastSurgicalHistoryComponent', () => {
  let component: PastSurgicalHistoryComponent;
  let fixture: ComponentFixture<PastSurgicalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastSurgicalHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PastSurgicalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
