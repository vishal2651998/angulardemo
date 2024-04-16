import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadDetailHeaderComponent } from './thread-detail-header.component';

describe('ThreadDetailHeaderComponent', () => {
  let component: ThreadDetailHeaderComponent;
  let fixture: ComponentFixture<ThreadDetailHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadDetailHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadDetailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
