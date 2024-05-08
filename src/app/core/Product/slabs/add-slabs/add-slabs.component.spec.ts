import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSlabsComponent } from './add-slabs.component';

describe('AddSlabsComponent', () => {
  let component: AddSlabsComponent;
  let fixture: ComponentFixture<AddSlabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSlabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSlabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
