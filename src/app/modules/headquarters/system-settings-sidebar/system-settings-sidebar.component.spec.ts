import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemSettingsSidebarComponent } from './system-settings-sidebar.component';

describe('SystemSettingsSidebarComponent', () => {
  let component: SystemSettingsSidebarComponent;
  let fixture: ComponentFixture<SystemSettingsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemSettingsSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemSettingsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
