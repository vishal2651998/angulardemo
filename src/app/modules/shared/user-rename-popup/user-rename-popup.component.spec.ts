import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRenamePopupComponent } from './user-rename-popup.component';

describe('UserRenamePopupComponent', () => {
  let component: UserRenamePopupComponent;
  let fixture: ComponentFixture<UserRenamePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRenamePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRenamePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
