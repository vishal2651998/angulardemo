import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProductCodesComponent } from './manage-product-codes.component';

describe('ManageProductCodesComponent', () => {
  let component: ManageProductCodesComponent;
  let fixture: ComponentFixture<ManageProductCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageProductCodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProductCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
