import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemInfoViewComponent } from './system-info-view.component';

describe('SystemInfoViewComponent', () => {
  let component: SystemInfoViewComponent;
  let fixture: ComponentFixture<SystemInfoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemInfoViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemInfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
