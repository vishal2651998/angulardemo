import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MarketplaceSidebarComponent } from './marketplace-sidebar.component';

describe('SidebarComponent', () => {
  let component: MarketplaceSidebarComponent;
  let fixture: ComponentFixture<MarketplaceSidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
