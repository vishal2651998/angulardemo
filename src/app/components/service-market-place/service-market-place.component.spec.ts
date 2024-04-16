import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceMarketPlaceComponent } from './service-market-place.component';

describe('ServiceMarketPlaceComponent', () => {
  let component: ServiceMarketPlaceComponent;
  let fixture: ComponentFixture<ServiceMarketPlaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceMarketPlaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceMarketPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
