import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductStepOneComponent } from './add-product-step-one.component';

describe('AddProductStepOneComponent', () => {
  let component: AddProductStepOneComponent;
  let fixture: ComponentFixture<AddProductStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductStepOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
