import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNewPurchaseComponent } from './list-new-purchase.component';

describe('ListNewPurchaseComponent', () => {
  let component: ListNewPurchaseComponent;
  let fixture: ComponentFixture<ListNewPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListNewPurchaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListNewPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
