import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministerNewFormComponent } from './administer-new-form.component';

describe('AdministerNewFormComponent', () => {
  let component: AdministerNewFormComponent;
  let fixture: ComponentFixture<AdministerNewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministerNewFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdministerNewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
