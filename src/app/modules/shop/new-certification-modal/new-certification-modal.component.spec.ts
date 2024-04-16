import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCertificationModalComponent } from './new-certification-modal.component';

describe('NewCertificationModalComponent', () => {
  let component: NewCertificationModalComponent;
  let fixture: ComponentFixture<NewCertificationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCertificationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCertificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
