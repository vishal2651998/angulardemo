import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkstreamPageComponent } from './workstream-page.component';

describe('WorkstreamPageComponent', () => {
  let component: WorkstreamPageComponent;
  let fixture: ComponentFixture<WorkstreamPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkstreamPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkstreamPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
