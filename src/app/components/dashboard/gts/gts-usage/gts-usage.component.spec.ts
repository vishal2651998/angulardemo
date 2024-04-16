import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GtsUsageComponent } from './gts-usage.component';

describe('GtsUsageComponent', () => {
  let component: GtsUsageComponent;
  let fixture: ComponentFixture<GtsUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GtsUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GtsUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
