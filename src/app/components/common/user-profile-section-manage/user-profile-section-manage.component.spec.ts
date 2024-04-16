import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileSectionManageComponent } from './user-profile-section-manage.component';

describe('UserProfileSectionManageComponent', () => {
  let component: UserProfileSectionManageComponent;
  let fixture: ComponentFixture<UserProfileSectionManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProfileSectionManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileSectionManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
