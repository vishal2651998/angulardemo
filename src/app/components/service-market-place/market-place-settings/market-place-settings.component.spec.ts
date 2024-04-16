import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPlaceSettingsComponent } from './market-place-settings.component';

describe('MarketPlaceZoomSettingComponent', () => {
  let component: MarketPlaceSettingsComponent;
  let fixture: ComponentFixture<MarketPlaceSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketPlaceSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketPlaceSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
