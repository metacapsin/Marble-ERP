import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitReasonsListComponent } from './visit-reasons-list.component';

describe('VisitReasonsListComponent', () => {
  let component: VisitReasonsListComponent;
  let fixture: ComponentFixture<VisitReasonsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitReasonsListComponent]
    });
    fixture = TestBed.createComponent(VisitReasonsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
