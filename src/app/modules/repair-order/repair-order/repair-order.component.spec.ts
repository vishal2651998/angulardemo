import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairOrderComponent } from './repair-order.component';

describe('RepairOrderComponent', () => {
  let component: RepairOrderComponent;
  let fixture: ComponentFixture<RepairOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
