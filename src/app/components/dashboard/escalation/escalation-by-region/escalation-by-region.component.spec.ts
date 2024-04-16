import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalationByRegionComponent } from './escalation-by-region.component';

describe('EscalationByRegionComponent', () => {
  let component: EscalationByRegionComponent;
  let fixture: ComponentFixture<EscalationByRegionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscalationByRegionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscalationByRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
