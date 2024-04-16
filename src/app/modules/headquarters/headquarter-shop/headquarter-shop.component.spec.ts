import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadquarterShopComponent } from './headquarter-shop.component';

describe('HeadquarterShopComponent', () => {
  let component: HeadquarterShopComponent;
  let fixture: ComponentFixture<HeadquarterShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadquarterShopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadquarterShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
