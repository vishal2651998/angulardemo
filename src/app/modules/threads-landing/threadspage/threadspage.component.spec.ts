import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadspageComponent } from './threadspage.component';

describe('ThreadspageComponent', () => {
  let component: ThreadspageComponent;
  let fixture: ComponentFixture<ThreadspageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadspageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
