import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceLocationEditComponent } from './service-location-edit.component';

describe('ServiceLocationEditComponent', () => {
  let component: ServiceLocationEditComponent;
  let fixture: ComponentFixture<ServiceLocationEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceLocationEditComponent]
    });
    fixture = TestBed.createComponent(ServiceLocationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
