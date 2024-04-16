import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMembersStatusWidgetsComponent } from './team-members-status-widgets.component';

describe('TeamMembersStatusWidgetsComponent', () => {
  let component: TeamMembersStatusWidgetsComponent;
  let fixture: ComponentFixture<TeamMembersStatusWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamMembersStatusWidgetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMembersStatusWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
