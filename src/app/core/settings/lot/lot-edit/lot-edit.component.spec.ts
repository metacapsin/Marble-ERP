import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotEditComponent } from './lot-edit.component';

describe('LotEditComponent', () => {
  let component: LotEditComponent;
  let fixture: ComponentFixture<LotEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LotEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LotEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
