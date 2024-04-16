import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadConfigComponent } from './thread-config.component';

describe('ThreadConfigComponent', () => {
  let component: ThreadConfigComponent;
  let fixture: ComponentFixture<ThreadConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
