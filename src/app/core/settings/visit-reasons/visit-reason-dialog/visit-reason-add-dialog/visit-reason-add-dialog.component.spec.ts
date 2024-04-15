import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitReasonAddDialogComponent } from './visit-reason-add-dialog.component';

describe('VisitReasonAddDialogComponent', () => {
  let component: VisitReasonAddDialogComponent;
  let fixture: ComponentFixture<VisitReasonAddDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitReasonAddDialogComponent]
    });
    fixture = TestBed.createComponent(VisitReasonAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
