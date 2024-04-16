import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairOrderDetailViewComponent } from './repair-order-detail-view.component';

describe('RepairOrderDetailViewComponent', () => {
  let component: RepairOrderDetailViewComponent;
  let fixture: ComponentFixture<RepairOrderDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairOrderDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairOrderDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
