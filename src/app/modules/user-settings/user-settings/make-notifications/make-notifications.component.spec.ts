import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeNotificationsComponent } from './make-notifications.component';

describe('MakeNotificationsComponent', () => {
  let component: MakeNotificationsComponent;
  let fixture: ComponentFixture<MakeNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeNotificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
