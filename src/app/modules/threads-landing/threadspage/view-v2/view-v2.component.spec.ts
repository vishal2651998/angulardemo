import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewV2Component } from './view-v2.component';

describe('ViewV2Component', () => {
  let component: ViewV2Component;
  let fixture: ComponentFixture<ViewV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
