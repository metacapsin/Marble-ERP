import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeListComponent } from './practice-list.component';

describe('PracticeListComponent', () => {
  let component: PracticeListComponent;
  let fixture: ComponentFixture<PracticeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PracticeListComponent]
    });
    fixture = TestBed.createComponent(PracticeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
