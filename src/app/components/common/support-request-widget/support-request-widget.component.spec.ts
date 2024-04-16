import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportRequestWidgetComponent } from './support-request-widget.component';

describe('SupportRequestWidgetComponent', () => {
  let component: SupportRequestWidgetComponent;
  let fixture: ComponentFixture<SupportRequestWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportRequestWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportRequestWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
