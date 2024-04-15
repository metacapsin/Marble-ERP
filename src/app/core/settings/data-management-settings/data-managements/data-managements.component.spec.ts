import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataManagementsComponent } from './data-managements.component';

describe('DataManagementsComponent', () => {
  let component: DataManagementsComponent;
  let fixture: ComponentFixture<DataManagementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataManagementsComponent]
    });
    fixture = TestBed.createComponent(DataManagementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
