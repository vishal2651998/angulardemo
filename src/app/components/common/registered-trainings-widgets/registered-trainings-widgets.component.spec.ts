import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredTrainingsWidgetsComponent } from './registered-trainings-widgets.component';

describe('RegisteredTrainingsWidgetsComponent', () => {
  let component: RegisteredTrainingsWidgetsComponent;
  let fixture: ComponentFixture<RegisteredTrainingsWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisteredTrainingsWidgetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredTrainingsWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
