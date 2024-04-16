import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixThreadsComponent } from './fix-threads.component';

describe('FixThreadsComponent', () => {
  let component: FixThreadsComponent;
  let fixture: ComponentFixture<FixThreadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixThreadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixThreadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
