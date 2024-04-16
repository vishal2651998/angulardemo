import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexSolrComponent } from './index-solr.component';

describe('IndexSolrComponent', () => {
  let component: IndexSolrComponent;
  let fixture: ComponentFixture<IndexSolrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexSolrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexSolrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
