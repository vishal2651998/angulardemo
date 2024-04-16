import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejoinCallComponent } from './rejoin-call.component';

describe('RejoinCallComponent', () => {
  let component: RejoinCallComponent;
  let fixture: ComponentFixture<RejoinCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejoinCallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejoinCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
