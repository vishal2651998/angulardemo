import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GtsSessionsComponent } from './gts-sessions.component';

describe('GtsSessionsComponent', () => {
  let component: GtsSessionsComponent;
  let fixture: ComponentFixture<GtsSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GtsSessionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GtsSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
