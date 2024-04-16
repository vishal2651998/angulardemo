import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechsupportTeamComponent } from './techsupport-team.component';

describe('TechsupportTeamComponent', () => {
  let component: TechsupportTeamComponent;
  let fixture: ComponentFixture<TechsupportTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechsupportTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechsupportTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
