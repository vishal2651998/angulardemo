import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPlaceQuizQuestionsListComponent } from './market-place-quiz-questions-list.component';

describe('MarketPlaceQuizQuestionsListComponent', () => {
  let component: MarketPlaceQuizQuestionsListComponent;
  let fixture: ComponentFixture<MarketPlaceQuizQuestionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketPlaceQuizQuestionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketPlaceQuizQuestionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
