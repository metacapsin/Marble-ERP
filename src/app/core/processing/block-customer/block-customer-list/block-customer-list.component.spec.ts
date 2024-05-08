import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockCustomerListComponent } from './block-customer-list.component';

describe('BlockCustomerListComponent', () => {
  let component: BlockCustomerListComponent;
  let fixture: ComponentFixture<BlockCustomerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockCustomerListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlockCustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
