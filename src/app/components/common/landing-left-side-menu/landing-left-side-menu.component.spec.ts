import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingLeftSideMenuComponent } from './landing-left-side-menu.component';

describe('LandingLeftSideMenuComponent', () => {
  let component: LandingLeftSideMenuComponent;
  let fixture: ComponentFixture<LandingLeftSideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingLeftSideMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingLeftSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
