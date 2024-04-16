import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeArticlesComponent } from './knowledge-articles.component';

describe('KnowledgeArticlesComponent', () => {
  let component: KnowledgeArticlesComponent;
  let fixture: ComponentFixture<KnowledgeArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnowledgeArticlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
