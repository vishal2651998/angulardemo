import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDetailInspectionComponent } from './shop-detail-inspection.component';

describe('ShopDetailInspectionComponent', () => {
  let component: ShopDetailInspectionComponent;
  let fixture: ComponentFixture<ShopDetailInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopDetailInspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopDetailInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
