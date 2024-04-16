import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRepairfyDomainComponent } from './manage-repairfy-domain.component';

describe('ManageRepairfyDomainComponent', () => {
  let component: ManageRepairfyDomainComponent;
  let fixture: ComponentFixture<ManageRepairfyDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRepairfyDomainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRepairfyDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
