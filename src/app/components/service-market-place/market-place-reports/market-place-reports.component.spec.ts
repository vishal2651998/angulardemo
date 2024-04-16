import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPlaceReportsComponent } from './market-place-reports.component';

describe('MarketPlaceReportsComponent', () => {
  let component: MarketPlaceReportsComponent;
  let fixture: ComponentFixture<MarketPlaceReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketPlaceReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketPlaceReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
