import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairOrderListComponent } from './repair-order-list.component';

describe('RepairOrderListComponent', () => {
  let component: RepairOrderListComponent;
  let fixture: ComponentFixture<RepairOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairOrderListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
