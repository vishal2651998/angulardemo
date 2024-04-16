import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDetailsSidebarComponent } from './shop-details-sidebar.component';

describe('ShopDetailsSidebarComponent', () => {
  let component: ShopDetailsSidebarComponent;
  let fixture: ComponentFixture<ShopDetailsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopDetailsSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopDetailsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
