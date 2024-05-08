import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBlocksComponent } from './list-blocks.component';

describe('ListBlocksComponent', () => {
  let component: ListBlocksComponent;
  let fixture: ComponentFixture<ListBlocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBlocksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListBlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
