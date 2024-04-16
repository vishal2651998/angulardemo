import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonUserComponent } from './non-user.component';

describe('NonUserComponent', () => {
  let component: NonUserComponent;
  let fixture: ComponentFixture<NonUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
