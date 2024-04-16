import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllToolsHeadquarterComponent } from './all-tools-headquarter.component';

describe('AllToolsHeadquarterComponent', () => {
  let component: AllToolsHeadquarterComponent;
  let fixture: ComponentFixture<AllToolsHeadquarterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllToolsHeadquarterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllToolsHeadquarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
