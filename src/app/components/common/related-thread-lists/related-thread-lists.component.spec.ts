import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedThreadListsComponent } from './related-thread-lists.component';

describe('RelatedThreadListsComponent', () => {
  let component: RelatedThreadListsComponent;
  let fixture: ComponentFixture<RelatedThreadListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedThreadListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedThreadListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
