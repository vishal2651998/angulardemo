import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveGroupPopupComponent } from './leave-group-popup.component';

describe('LeaveGroupPopupComponent', () => {
  let component: LeaveGroupPopupComponent;
  let fixture: ComponentFixture<LeaveGroupPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveGroupPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveGroupPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
