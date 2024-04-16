import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPlaceQuizTopicsComponent } from './market-place-quiz-topics.component';

describe('MarketPlaceQuizTopicsComponent', () => {
  let component: MarketPlaceQuizTopicsComponent;
  let fixture: ComponentFixture<MarketPlaceQuizTopicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketPlaceQuizTopicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketPlaceQuizTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
