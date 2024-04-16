import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadquarterSummaryComponent } from './headquarter-summary.component';

describe('HeadquarterSummaryComponent', () => {
  let component: HeadquarterSummaryComponent;
  let fixture: ComponentFixture<HeadquarterSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadquarterSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadquarterSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
