import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidersProfileViewComponent } from './providers-profile-view.component';

describe('ProvidersProfileViewComponent', () => {
  let component: ProvidersProfileViewComponent;
  let fixture: ComponentFixture<ProvidersProfileViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProvidersProfileViewComponent]
    });
    fixture = TestBed.createComponent(ProvidersProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
