import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOldComponent } from './view-old.component';

describe('ViewOldComponent', () => {
  let component: ViewOldComponent;
  let fixture: ComponentFixture<ViewOldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
