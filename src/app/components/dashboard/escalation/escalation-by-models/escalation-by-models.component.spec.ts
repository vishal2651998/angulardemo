import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalationByModelsComponent } from './escalation-by-models.component';

describe('EscalationByModelsComponent', () => {
  let component: EscalationByModelsComponent;
  let fixture: ComponentFixture<EscalationByModelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscalationByModelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscalationByModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
