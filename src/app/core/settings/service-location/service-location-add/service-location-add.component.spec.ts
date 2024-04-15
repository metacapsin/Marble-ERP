import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceLocationAddComponent } from './service-location-add.component';

describe('ServiceLocationAddComponent', () => {
  let component: ServiceLocationAddComponent;
  let fixture: ComponentFixture<ServiceLocationAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceLocationAddComponent]
    });
    fixture = TestBed.createComponent(ServiceLocationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
