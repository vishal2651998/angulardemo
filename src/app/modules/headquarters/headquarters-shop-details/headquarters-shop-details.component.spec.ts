import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadquartersShopDetailsComponent } from './headquarters-shop-details.component';

describe('HeadquartersShopDetailsComponent', () => {
  let component: HeadquartersShopDetailsComponent;
  let fixture: ComponentFixture<HeadquartersShopDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadquartersShopDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadquartersShopDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
