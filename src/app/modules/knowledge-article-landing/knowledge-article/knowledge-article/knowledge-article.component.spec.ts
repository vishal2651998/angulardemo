import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeArticleComponent } from './knowledge-article.component';

describe('KnowledgeArticleComponent', () => {
  let component: KnowledgeArticleComponent;
  let fixture: ComponentFixture<KnowledgeArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnowledgeArticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
