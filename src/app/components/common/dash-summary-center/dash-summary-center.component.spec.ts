import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashSummaryCenterComponent } from './dash-summary-center.component';

describe('DashSummaryCenterComponent', () => {
  let component: DashSummaryCenterComponent;
  let fixture: ComponentFixture<DashSummaryCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashSummaryCenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashSummaryCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
