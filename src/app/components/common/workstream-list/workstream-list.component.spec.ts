import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WorkstreamListComponent } from './workstream-list.component';

describe('WorkstreamListComponent', () => {
  let component: WorkstreamListComponent;
  let fixture: ComponentFixture<WorkstreamListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkstreamListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkstreamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});