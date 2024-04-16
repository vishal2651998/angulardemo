import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShopPopupComponent } from './add-shop.component';

describe('AddShopPopupComponent', () => {
  let component: AddShopPopupComponent;
  let fixture: ComponentFixture<AddShopPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddShopPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShopPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
