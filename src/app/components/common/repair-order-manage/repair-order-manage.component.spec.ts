import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairOrderManageComponent } from './repair-order-manage.component';

describe('RepairOrderManageComponent', () => {
  let component: RepairOrderManageComponent;
  let fixture: ComponentFixture<RepairOrderManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairOrderManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairOrderManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
