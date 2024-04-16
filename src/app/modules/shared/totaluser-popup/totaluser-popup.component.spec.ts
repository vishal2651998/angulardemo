import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotaluserPopupComponent } from './totaluser-popup.component';

describe('TotaluserPopupComponent', () => {
  let component: TotaluserPopupComponent;
  let fixture: ComponentFixture<TotaluserPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotaluserPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotaluserPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
