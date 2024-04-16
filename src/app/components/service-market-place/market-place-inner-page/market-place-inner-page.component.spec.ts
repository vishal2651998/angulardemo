import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPlaceInnerPageComponent } from './market-place-inner-page.component';

describe('MarketPlaceInnerPageComponent', () => {
  let component: MarketPlaceInnerPageComponent;
  let fixture: ComponentFixture<MarketPlaceInnerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketPlaceInnerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketPlaceInnerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
