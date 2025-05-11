import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSlabBlockComponent } from './add-slab-block.component';

describe('AddSlabBlockComponent', () => {
  let component: AddSlabBlockComponent;
  let fixture: ComponentFixture<AddSlabBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSlabBlockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSlabBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
