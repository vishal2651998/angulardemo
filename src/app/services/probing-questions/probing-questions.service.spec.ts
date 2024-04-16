import { TestBed } from '@angular/core/testing';

import { ProbingQuestionsService } from './probing-questions.service';

describe('ProbingQuestionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProbingQuestionsService = TestBed.get(ProbingQuestionsService);
    expect(service).toBeTruthy();
  });
});
