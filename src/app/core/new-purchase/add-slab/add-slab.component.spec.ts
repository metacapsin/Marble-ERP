import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSlabComponent } from './add-slab.component';

describe('AddSlabComponent', () => {
  let component: AddSlabComponent;
  let fixture: ComponentFixture<AddSlabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSlabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});