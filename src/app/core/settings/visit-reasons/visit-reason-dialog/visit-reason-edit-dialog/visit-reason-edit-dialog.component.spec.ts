import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitReasonEditDialogComponent } from './visit-reason-edit-dialog.component';

describe('VisitReasonEditDialogComponent', () => {
  let component: VisitReasonEditDialogComponent;
  let fixture: ComponentFixture<VisitReasonEditDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitReasonEditDialogComponent]
    });
    fixture = TestBed.createComponent(VisitReasonEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
