import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSubscriptionModalComponent } from './new-subscription-modal.component';

describe('NewSubscriptionModalComponent', () => {
  let component: NewSubscriptionModalComponent;
  let fixture: ComponentFixture<NewSubscriptionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSubscriptionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSubscriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
