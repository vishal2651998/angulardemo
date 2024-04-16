import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalationZonesComponent } from './escalation-zones.component';

describe('EscalationZonesComponent', () => {
  let component: EscalationZonesComponent;
  let fixture: ComponentFixture<EscalationZonesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscalationZonesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscalationZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
