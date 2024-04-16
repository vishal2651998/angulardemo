import { TestBed } from '@angular/core/testing';

import { WorkstreamService } from './workstream.service';

describe('WorkstreamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkstreamService = TestBed.get(WorkstreamService);
    expect(service).toBeTruthy();
  });
});
