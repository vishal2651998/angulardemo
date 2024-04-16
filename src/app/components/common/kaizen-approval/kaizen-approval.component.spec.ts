import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaizenApprovalComponent } from './kaizen-approval.component';

describe('KaizenApprovalComponent', () => {
  let component: KaizenApprovalComponent;
  let fixture: ComponentFixture<KaizenApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaizenApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaizenApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
