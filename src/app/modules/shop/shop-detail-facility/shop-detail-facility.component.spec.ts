import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDetailFacilityComponent } from './shop-detail-facility.component';

describe('ShopDetailFacilityComponent', () => {
  let component: ShopDetailFacilityComponent;
  let fixture: ComponentFixture<ShopDetailFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopDetailFacilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopDetailFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
