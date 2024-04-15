import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceLocationListComponent } from './service-location-list.component';

describe('ServiceLocationListComponent', () => {
  let component: ServiceLocationListComponent;
  let fixture: ComponentFixture<ServiceLocationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceLocationListComponent]
    });
    fixture = TestBed.createComponent(ServiceLocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
