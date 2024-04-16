import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthRightPanelComponent } from './auth-right-panel.component';

describe('AuthRightPanelComponent', () => {
  let component: AuthRightPanelComponent;
  let fixture: ComponentFixture<AuthRightPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthRightPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthRightPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
