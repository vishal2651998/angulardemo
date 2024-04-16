import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalationWidgetsComponent } from './escalation-widgets.component';

describe('EscalationWidgetsComponent', () => {
  let component: EscalationWidgetsComponent;
  let fixture: ComponentFixture<EscalationWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EscalationWidgetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EscalationWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
