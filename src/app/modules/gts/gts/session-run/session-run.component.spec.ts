import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionRunComponent } from './session-run.component';

describe('SessionRunComponent', () => {
  let component: SessionRunComponent;
  let fixture: ComponentFixture<SessionRunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionRunComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
