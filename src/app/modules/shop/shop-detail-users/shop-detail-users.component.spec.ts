import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDetailUsersComponent } from './shop-detail-users.component';

describe('ShopDetailUsersComponent', () => {
  let component: ShopDetailUsersComponent;
  let fixture: ComponentFixture<ShopDetailUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopDetailUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopDetailUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
