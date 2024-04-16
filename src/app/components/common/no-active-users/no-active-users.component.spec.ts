import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoActiveUsersComponent } from './no-active-users.component';

describe('NoActiveUsersComponent', () => {
  let component: NoActiveUsersComponent;
  let fixture: ComponentFixture<NoActiveUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoActiveUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoActiveUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
