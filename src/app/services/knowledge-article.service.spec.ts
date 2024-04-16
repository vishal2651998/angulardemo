import { TestBed } from '@angular/core/testing';

import { KnowledgeArticleService } from './knowledge-article.service';

describe('KnowledgeArticleService', () => {
  let service: KnowledgeArticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KnowledgeArticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
