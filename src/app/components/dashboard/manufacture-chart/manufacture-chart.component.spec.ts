import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureChartComponent } from './manufacture-chart.component';

describe('ManufactureChartComponent', () => {
  let component: ManufactureChartComponent;
  let fixture: ComponentFixture<ManufactureChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManufactureChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufactureChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
