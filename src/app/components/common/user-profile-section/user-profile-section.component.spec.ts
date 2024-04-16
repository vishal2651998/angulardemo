import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileSectionComponent } from './user-profile-section.component';

describe('UserProfileSectionComponent', () => {
  let component: UserProfileSectionComponent;
  let fixture: ComponentFixture<UserProfileSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProfileSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
