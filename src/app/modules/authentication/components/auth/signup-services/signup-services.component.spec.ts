import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupServicesComponent } from './signup-services.component';

describe('SignupServicesComponent', () => {
  let component: SignupServicesComponent;
  let fixture: ComponentFixture<SignupServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
