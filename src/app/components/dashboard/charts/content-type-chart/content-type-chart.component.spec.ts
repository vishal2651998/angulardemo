import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentTypeChartComponent } from './content-type-chart.component';

describe('ContentTypeChartComponent', () => {
  let component: ContentTypeChartComponent;
  let fixture: ComponentFixture<ContentTypeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentTypeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentTypeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
