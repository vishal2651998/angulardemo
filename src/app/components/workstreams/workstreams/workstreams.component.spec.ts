import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WorkstreamsComponent } from './workstreams.component';

describe('WorkstreamsComponent', () => {
  let component: WorkstreamsComponent;
  let fixture: ComponentFixture<WorkstreamsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkstreamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkstreamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
