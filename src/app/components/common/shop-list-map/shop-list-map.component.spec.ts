import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopListMapComponent } from './shop-list-map.component';

describe('ShopListMapComponent', () => {
  let component: ShopListMapComponent;
  let fixture: ComponentFixture<ShopListMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopListMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopListMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
