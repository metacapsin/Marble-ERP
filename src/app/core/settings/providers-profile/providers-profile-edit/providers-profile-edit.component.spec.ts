import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidersProfileEditComponent } from './providers-profile-edit.component';

describe('ProvidersProfileEditComponent', () => {
  let component: ProvidersProfileEditComponent;
  let fixture: ComponentFixture<ProvidersProfileEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProvidersProfileEditComponent]
    });
    fixture = TestBed.createComponent(ProvidersProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
