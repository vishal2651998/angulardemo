import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardReportListComponent } from './standard-report-list.component';

describe('StandardReportListComponent', () => {
  let component: StandardReportListComponent;
  let fixture: ComponentFixture<StandardReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandardReportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
