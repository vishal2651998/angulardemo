import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentControllerComponent } from './payment-controller.component';

describe('PaymentControllerComponent', () => {
  let component: PaymentControllerComponent;
  let fixture: ComponentFixture<PaymentControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
