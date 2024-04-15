import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptSettingsComponent } from './receipt-settings.component';

describe('ReceiptSettingsComponent', () => {
  let component: ReceiptSettingsComponent;
  let fixture: ComponentFixture<ReceiptSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiptSettingsComponent]
    });
    fixture = TestBed.createComponent(ReceiptSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
