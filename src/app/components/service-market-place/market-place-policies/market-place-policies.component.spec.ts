import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPlacePoliciesComponent } from './market-place-policies.component';

describe('MarketPlacePoliciesComponent', () => {
  let component: MarketPlacePoliciesComponent;
  let fixture: ComponentFixture<MarketPlacePoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketPlacePoliciesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketPlacePoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
