import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDashboardHeaderComponent } from './user-dashboard-header.component';

describe('UserDashboardHeaderComponent', () => {
  let component: UserDashboardHeaderComponent;
  let fixture: ComponentFixture<UserDashboardHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDashboardHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDashboardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
