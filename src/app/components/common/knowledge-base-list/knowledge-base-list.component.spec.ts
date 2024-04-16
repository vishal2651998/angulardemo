import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeBaseListComponent } from './knowledge-base-list.component';

describe('KnowledgeBaseListComponent', () => {
  let component: KnowledgeBaseListComponent;
  let fixture: ComponentFixture<KnowledgeBaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnowledgeBaseListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeBaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
