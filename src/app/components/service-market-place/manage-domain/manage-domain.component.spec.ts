import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDomainComponent } from './manage-domain.component';

describe('ManageDomainComponent', () => {
  let component: ManageDomainComponent;
  let fixture: ComponentFixture<ManageDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDomainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
