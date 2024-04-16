import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ThreadUsersComponent } from './thread-users.component';

describe('ThreadUsersComponent', () => {
  let component: ThreadUsersComponent;
  let fixture: ComponentFixture<ThreadUsersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreadUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
