import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPlaceManualsComponent } from './market-place-manuals.component';

describe('MarketPlaceManualsComponent', () => {
  let component: MarketPlaceManualsComponent;
  let fixture: ComponentFixture<MarketPlaceManualsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketPlaceManualsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketPlaceManualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
