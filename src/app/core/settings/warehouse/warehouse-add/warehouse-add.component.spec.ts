import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseAddComponent } from './warehouse-add.component';

describe('WarehouseAddComponent', () => {
  let component: WarehouseAddComponent;
  let fixture: ComponentFixture<WarehouseAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarehouseAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
