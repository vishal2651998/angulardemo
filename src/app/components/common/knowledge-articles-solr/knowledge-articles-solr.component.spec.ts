import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeArticlesSolrComponent } from './knowledge-articles-solr.component';

describe('KnowledgeArticlesSolrComponent', () => {
  let component: KnowledgeArticlesSolrComponent;
  let fixture: ComponentFixture<KnowledgeArticlesSolrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnowledgeArticlesSolrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeArticlesSolrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
