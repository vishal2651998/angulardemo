import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListShopComponent } from './list-shop.component';

describe('ListShopComponent', () => {
  let component: ListShopComponent;
  let fixture: ComponentFixture<ListShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListShopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
