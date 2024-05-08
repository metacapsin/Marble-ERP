import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSlabsComponent } from './edit-slabs.component';

describe('EditSlabsComponent', () => {
  let component: EditSlabsComponent;
  let fixture: ComponentFixture<EditSlabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSlabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditSlabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
