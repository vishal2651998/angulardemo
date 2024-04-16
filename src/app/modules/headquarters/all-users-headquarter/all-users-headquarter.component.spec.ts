import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUsersHeadquarterComponent } from './all-users-headquarter.component';

describe('AllUsersHeadquarterComponent', () => {
  let component: AllUsersHeadquarterComponent;
  let fixture: ComponentFixture<AllUsersHeadquarterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllUsersHeadquarterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllUsersHeadquarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
