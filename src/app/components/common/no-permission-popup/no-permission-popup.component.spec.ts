import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPermissionPopupComponent } from './no-permission-popup.component';

describe('NoPermissionPopupComponent', () => {
  let component: NoPermissionPopupComponent;
  let fixture: ComponentFixture<NoPermissionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoPermissionPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoPermissionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
