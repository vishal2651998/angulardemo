import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DekraAuditListComponent } from './dekra-audit-list.component';

describe('DekraAuditListComponent', () => {
  let component: DekraAuditListComponent;
  let fixture: ComponentFixture<DekraAuditListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DekraAuditListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DekraAuditListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
