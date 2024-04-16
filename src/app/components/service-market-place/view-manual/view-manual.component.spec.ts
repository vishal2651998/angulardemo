import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewManualComponent } from './view-manual.component';

describe('ViewManualComponent', () => {
  let component: ViewManualComponent;
  let fixture: ComponentFixture<ViewManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
