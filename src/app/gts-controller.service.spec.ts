import { TestBed } from '@angular/core/testing';

import { GtsControllerService } from './gts-controller.service';

describe('GtsControllerService', () => {
  let service: GtsControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GtsControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
