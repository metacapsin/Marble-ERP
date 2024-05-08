import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBlocksComponent } from './add-blocks.component';

describe('AddBlocksComponent', () => {
  let component: AddBlocksComponent;
  let fixture: ComponentFixture<AddBlocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBlocksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddBlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
