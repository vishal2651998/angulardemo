import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalationLevelComponent } from './escalation-level.component';

describe('EscalationLevelComponent', () => {
  let component: EscalationLevelComponent;
  let fixture: ComponentFixture<EscalationLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EscalationLevelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EscalationLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
