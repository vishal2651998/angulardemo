import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaysLoginPOPUPComponent } from './days-login-popup.component';

describe('DaysLoginPOPUPComponent', () => {
  let component: DaysLoginPOPUPComponent;
  let fixture: ComponentFixture<DaysLoginPOPUPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaysLoginPOPUPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaysLoginPOPUPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
