import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPlaceReportDetailsComponent } from './market-place-report-details.component';

describe('MarketPlaceReportDetailsComponent', () => {
  let component: MarketPlaceReportDetailsComponent;
  let fixture: ComponentFixture<MarketPlaceReportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketPlaceReportDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketPlaceReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
