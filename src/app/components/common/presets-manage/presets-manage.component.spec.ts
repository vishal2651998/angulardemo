import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresetsManageComponent } from './presets-manage.component';

describe('PresetsManageComponent', () => {
  let component: PresetsManageComponent;
  let fixture: ComponentFixture<PresetsManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresetsManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresetsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
