import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSlabsComponent } from './list-slabs.component';

describe('ListSlabsComponent', () => {
  let component: ListSlabsComponent;
  let fixture: ComponentFixture<ListSlabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSlabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListSlabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
