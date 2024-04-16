import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugsAndFeaturesComponent } from './bugs-and-features.component';

describe('BugsAndFeaturesComponent', () => {
  let component: BugsAndFeaturesComponent;
  let fixture: ComponentFixture<BugsAndFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BugsAndFeaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BugsAndFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
