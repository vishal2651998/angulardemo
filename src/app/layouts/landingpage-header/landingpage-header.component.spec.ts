import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingpageHeaderComponent } from './landingpage-header.component';

describe('LandingpageHeaderComponent', () => {
  let component: LandingpageHeaderComponent;
  let fixture: ComponentFixture<LandingpageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingpageHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingpageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
