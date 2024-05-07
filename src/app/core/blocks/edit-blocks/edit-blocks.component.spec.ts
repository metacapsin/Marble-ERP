import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBlocksComponent } from './edit-blocks.component';

describe('EditBlocksComponent', () => {
  let component: EditBlocksComponent;
  let fixture: ComponentFixture<EditBlocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBlocksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditBlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
