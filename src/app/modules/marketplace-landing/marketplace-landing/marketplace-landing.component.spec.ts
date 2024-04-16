import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceLandingComponent } from './marketplace-landing.component';

describe('MarketplaceLandingComponent', () => {
  let component: MarketplaceLandingComponent;
  let fixture: ComponentFixture<MarketplaceLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketplaceLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
