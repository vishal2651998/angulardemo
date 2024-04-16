import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualsPaymentControllerComponent } from './manuals-payment-controller.component';

describe('ManualsPaymentControllerComponent', () => {
  let component: ManualsPaymentControllerComponent;
  let fixture: ComponentFixture<ManualsPaymentControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualsPaymentControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualsPaymentControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
