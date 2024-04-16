import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCertificateComponent } from './profile-certificate.component';

describe('ProfileCertificateComponent', () => {
  let component: ProfileCertificateComponent;
  let fixture: ComponentFixture<ProfileCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
