import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailNotFoundComponent } from './email-not-found.component';

describe('EmailNotFoundComponent', () => {
  let component: EmailNotFoundComponent;
  let fixture: ComponentFixture<EmailNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailNotFoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
