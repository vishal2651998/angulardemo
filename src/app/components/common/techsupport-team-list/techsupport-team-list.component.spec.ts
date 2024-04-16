import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechsupportTeamListComponent } from './techsupport-team-list.component';

describe('TechsupportTeamListComponent', () => {
  let component: TechsupportTeamListComponent;
  let fixture: ComponentFixture<TechsupportTeamListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechsupportTeamListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechsupportTeamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
