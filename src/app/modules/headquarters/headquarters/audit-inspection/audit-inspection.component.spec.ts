import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditInspectionComponent } from './audit-inspection.component';

describe('AuditInspectionComponent', () => {
  let component: AuditInspectionComponent;
  let fixture: ComponentFixture<AuditInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditInspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
