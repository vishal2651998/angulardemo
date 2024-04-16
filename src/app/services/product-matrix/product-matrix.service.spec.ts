import { TestBed } from '@angular/core/testing';

import { ProductMatrixService } from './product-matrix.service';

describe('ProductMatrixService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductMatrixService = TestBed.get(ProductMatrixService);
    expect(service).toBeTruthy();
  });
});
