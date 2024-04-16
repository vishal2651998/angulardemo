import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDetailSummaryComponent } from './shop-detail-summary.component';

describe('ShopDetailSummaryComponent', () => {
  let component: ShopDetailSummaryComponent;
  let fixture: ComponentFixture<ShopDetailSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopDetailSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopDetailSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
