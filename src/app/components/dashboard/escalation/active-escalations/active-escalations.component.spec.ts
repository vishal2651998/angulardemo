import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveEscalationsComponent } from './active-escalations.component';

describe('ActiveEscalationsComponent', () => {
  let component: ActiveEscalationsComponent;
  let fixture: ComponentFixture<ActiveEscalationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveEscalationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveEscalationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
