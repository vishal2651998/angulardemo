import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllShopsHeadquarterComponent } from './all-shops-headquarter.component';

describe('AllShopsHeadquarterComponent', () => {
  let component: AllShopsHeadquarterComponent;
  let fixture: ComponentFixture<AllShopsHeadquarterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllShopsHeadquarterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllShopsHeadquarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
