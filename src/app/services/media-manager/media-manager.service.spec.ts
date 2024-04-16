import { TestBed } from '@angular/core/testing';

import { MediaManagerService } from './media-manager.service';

describe('MediaManagerService', () => {
  let service: MediaManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
