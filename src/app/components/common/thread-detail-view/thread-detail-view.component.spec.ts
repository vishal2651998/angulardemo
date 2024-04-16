import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadDetailViewComponent } from './thread-detail-view.component';

describe('ThreadDetailViewComponent', () => {
  let component: ThreadDetailViewComponent;
  let fixture: ComponentFixture<ThreadDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
