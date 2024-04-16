import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadApprovalComponent } from './thread-approval.component';

describe('ThreadApprovalComponent', () => {
  let component: ThreadApprovalComponent;
  let fixture: ComponentFixture<ThreadApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
