import { TestBed } from '@angular/core/testing';

import { ThreadPostService } from './thread-post.service';

describe('ThreadPostService', () => {
  let service: ThreadPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreadPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
