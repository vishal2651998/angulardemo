import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionLocationListComponent } from './inspection-location-list.component';

describe('InspectionLocationListComponent', () => {
  let component: InspectionLocationListComponent;
  let fixture: ComponentFixture<InspectionLocationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectionLocationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionLocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
