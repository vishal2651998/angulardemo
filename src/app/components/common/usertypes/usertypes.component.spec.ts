import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UsertypesComponent } from './usertypes.component';

describe('UsertypesComponent', () => {
  let component: UsertypesComponent;
  let fixture: ComponentFixture<UsertypesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UsertypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsertypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
