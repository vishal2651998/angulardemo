import { TestBed } from '@angular/core/testing';

import { GtsService } from './gts.service';

describe('GtsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GtsService = TestBed.get(GtsService);
    expect(service).toBeTruthy();
  });
});
