import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugAndFeatureComponent } from './bug-and-feature.component';

describe('BugAndFeatureComponent', () => {
  let component: BugAndFeatureComponent;
  let fixture: ComponentFixture<BugAndFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BugAndFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BugAndFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
