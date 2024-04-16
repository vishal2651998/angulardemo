import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatenamePopupComponent } from './updatename-popup.component';

describe('UpdatenamePopupComponent', () => {
  let component: UpdatenamePopupComponent;
  let fixture: ComponentFixture<UpdatenamePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatenamePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatenamePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
