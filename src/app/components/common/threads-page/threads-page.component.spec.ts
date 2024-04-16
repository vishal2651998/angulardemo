import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadsPageComponent } from './threads-page.component';

describe('ThreadsPageComponent', () => {
  let component: ThreadsPageComponent;
  let fixture: ComponentFixture<ThreadsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
