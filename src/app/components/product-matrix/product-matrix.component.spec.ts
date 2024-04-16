import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductMatrixComponent } from './product-matrix.component';

describe('ProductMatrixComponent', () => {
  let component: ProductMatrixComponent;
  let fixture: ComponentFixture<ProductMatrixComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
