import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabListsComponent } from './lab-lists.component';

describe('LabListsComponent', () => {
  let component: LabListsComponent;
  let fixture: ComponentFixture<LabListsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabListsComponent]
    });
    fixture = TestBed.createComponent(LabListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
