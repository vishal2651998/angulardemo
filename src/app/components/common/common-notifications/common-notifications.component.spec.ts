import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonNotificationsComponent } from './common-notifications.component';

describe('CommonNotificationsComponent', () => {
  let component: CommonNotificationsComponent;
  let fixture: ComponentFixture<CommonNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonNotificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
