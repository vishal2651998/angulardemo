import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginbgDomainComponent } from './loginbg-domain.component';

describe('LoginbgDomainComponent', () => {
  let component: LoginbgDomainComponent;
  let fixture: ComponentFixture<LoginbgDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginbgDomainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginbgDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
