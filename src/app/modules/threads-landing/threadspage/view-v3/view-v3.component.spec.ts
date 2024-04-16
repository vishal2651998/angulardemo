import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewV3Component } from './view-v3.component';

describe('ViewV3Component', () => {
  let component: ViewV3Component;
  let fixture: ComponentFixture<ViewV3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewV3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
