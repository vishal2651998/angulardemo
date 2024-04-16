import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DismissedComponent } from './dismissed.component';

describe('DismissedComponent', () => {
  let component: DismissedComponent;
  let fixture: ComponentFixture<DismissedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DismissedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DismissedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
