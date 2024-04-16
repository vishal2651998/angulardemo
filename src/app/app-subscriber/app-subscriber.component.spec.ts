import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSubscriberComponent } from './app-subscriber.component';

describe('AppSubscriberComponent', () => {
  let component: AppSubscriberComponent;
  let fixture: ComponentFixture<AppSubscriberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppSubscriberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSubscriberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
