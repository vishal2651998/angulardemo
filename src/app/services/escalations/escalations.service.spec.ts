import { TestBed } from '@angular/core/testing';

import { EscalationsService } from './escalations.service';

describe('EscalationsService', () => {
  let service: EscalationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EscalationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
