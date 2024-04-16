import { TestBed } from '@angular/core/testing';

import { RepairOrderService } from './repair-order.service';

describe('RepairOrderService', () => {
  let service: RepairOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepairOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
