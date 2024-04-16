import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileBusinessComponent } from './profile-business.component';

describe('ProfileBusinessComponent', () => {
  let component: ProfileBusinessComponent;
  let fixture: ComponentFixture<ProfileBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileBusinessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
