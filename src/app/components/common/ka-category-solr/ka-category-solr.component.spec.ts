import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaCategorySolrComponent } from './ka-category-solr.component';

describe('KaCategorySolrComponent', () => {
  let component: KaCategorySolrComponent;
  let fixture: ComponentFixture<KaCategorySolrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaCategorySolrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaCategorySolrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
