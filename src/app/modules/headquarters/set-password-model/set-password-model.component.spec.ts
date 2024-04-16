import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPasswordModelComponent } from './set-password-model.component';

describe('SetPasswordModelComponent', () => {
  let component: SetPasswordModelComponent;
  let fixture: ComponentFixture<SetPasswordModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetPasswordModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPasswordModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
