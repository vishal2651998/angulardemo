import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyEscalationsComponent } from './monthly-escalations.component';

describe('MonthlyEscalationsComponent', () => {
  let component: MonthlyEscalationsComponent;
  let fixture: ComponentFixture<MonthlyEscalationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyEscalationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyEscalationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
