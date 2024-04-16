import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamSupportRequestWidgetsComponent } from './team-support-request-widgets.component';

describe('TeamSupportRequestWidgetsComponent', () => {
  let component: TeamSupportRequestWidgetsComponent;
  let fixture: ComponentFixture<TeamSupportRequestWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamSupportRequestWidgetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamSupportRequestWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
