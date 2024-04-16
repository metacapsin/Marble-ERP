import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsalesComponent } from './addsales.component';

describe('AddsalesComponent', () => {
  let component: AddsalesComponent;
  let fixture: ComponentFixture<AddsalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddsalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddsalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
