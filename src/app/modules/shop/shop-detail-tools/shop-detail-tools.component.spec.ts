import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDetailToolsComponent } from './shop-detail-tools.component';

describe('ShopDetailToolsComponent', () => {
  let component: ShopDetailToolsComponent;
  let fixture: ComponentFixture<ShopDetailToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopDetailToolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopDetailToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
