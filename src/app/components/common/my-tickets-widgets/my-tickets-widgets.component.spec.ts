import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTicketsWidgetsComponent } from './my-tickets-widgets.component';

describe('MyTicketsWidgetsComponent', () => {
  let component: MyTicketsWidgetsComponent;
  let fixture: ComponentFixture<MyTicketsWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTicketsWidgetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTicketsWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
