import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceFooterComponent } from './marketplace-footer.component';

describe('MarketplaceFooterComponent', () => {
  let component: MarketplaceFooterComponent;
  let fixture: ComponentFixture<MarketplaceFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketplaceFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
