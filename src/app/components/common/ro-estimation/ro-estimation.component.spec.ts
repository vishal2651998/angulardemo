import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoEstimationComponent } from './ro-estimation.component';

describe('RoEstimationComponent', () => {
  let component: RoEstimationComponent;
  let fixture: ComponentFixture<RoEstimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoEstimationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoEstimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
