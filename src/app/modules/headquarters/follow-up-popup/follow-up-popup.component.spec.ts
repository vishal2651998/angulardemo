import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpPopupComponent } from './follow-up-popup.component';

describe('FollowUpPopupComponent', () => {
  let component: FollowUpPopupComponent;
  let fixture: ComponentFixture<FollowUpPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowUpPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
