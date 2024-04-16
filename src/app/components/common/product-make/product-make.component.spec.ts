import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductMakeComponent } from './product-make.component';

describe('ProductMakeComponent', () => {
  let component: ProductMakeComponent;
  let fixture: ComponentFixture<ProductMakeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductMakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
