import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPlaceCustomersComponent } from './market-place-customers.component';

describe('MarketPlaceCustomersComponent', () => {
  let component: MarketPlaceCustomersComponent;
  let fixture: ComponentFixture<MarketPlaceCustomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketPlaceCustomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketPlaceCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
