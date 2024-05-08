import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlabsComponent } from './slabs.component';

describe('SlabsComponent', () => {
  let component: SlabsComponent;
  let fixture: ComponentFixture<SlabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
