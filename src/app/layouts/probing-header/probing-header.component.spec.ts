import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProbingHeaderComponent } from './probing-header.component';

describe('ProbingHeaderComponent', () => {
  let component: ProbingHeaderComponent;
  let fixture: ComponentFixture<ProbingHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProbingHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProbingHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
