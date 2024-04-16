import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowersFollowingComponent } from './followers-following.component';

describe('FollowersFollowingComponent', () => {
  let component: FollowersFollowingComponent;
  let fixture: ComponentFixture<FollowersFollowingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowersFollowingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowersFollowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
