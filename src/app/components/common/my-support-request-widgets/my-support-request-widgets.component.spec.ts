import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySupportRequestWidgetsComponent } from './my-support-request-widgets.component';

describe('MySupportRequestWidgetsComponent', () => {
  let component: MySupportRequestWidgetsComponent;
  let fixture: ComponentFixture<MySupportRequestWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MySupportRequestWidgetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MySupportRequestWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
