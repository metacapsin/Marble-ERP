import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplantableDevicesComponent } from './implantable-devices.component';

describe('ImplantableDevicesComponent', () => {
  let component: ImplantableDevicesComponent;
  let fixture: ComponentFixture<ImplantableDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImplantableDevicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImplantableDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
