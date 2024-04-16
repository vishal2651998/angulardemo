import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceSystemactivityComponent } from './marketplace-systemactivity.component';

describe('MarketplaceSystemactivityComponent', () => {
  let component: MarketplaceSystemactivityComponent;
  let fixture: ComponentFixture<MarketplaceSystemactivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketplaceSystemactivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceSystemactivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
