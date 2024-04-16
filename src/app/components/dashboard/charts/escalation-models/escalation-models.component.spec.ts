import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalationModelsComponent } from './escalation-models.component';

describe('EscalationModelsComponent', () => {
  let component: EscalationModelsComponent;
  let fixture: ComponentFixture<EscalationModelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscalationModelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscalationModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
