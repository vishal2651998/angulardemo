import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGridInfoComponent } from './user-grid-info.component';

describe('UserGridInfoComponent', () => {
  let component: UserGridInfoComponent;
  let fixture: ComponentFixture<UserGridInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGridInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGridInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
