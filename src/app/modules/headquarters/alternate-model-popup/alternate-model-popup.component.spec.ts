import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternateModelPopupComponent } from './alternate-model-popup.component';

describe('AlternateModelPopupComponent', () => {
  let component: AlternateModelPopupComponent;
  let fixture: ComponentFixture<AlternateModelPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlternateModelPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlternateModelPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
