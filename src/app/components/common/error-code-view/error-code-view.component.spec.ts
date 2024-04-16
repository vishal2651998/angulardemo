import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorCodeViewComponent } from './error-code-view.component';

describe('ErrorCodeViewComponent', () => {
  let component: ErrorCodeViewComponent;
  let fixture: ComponentFixture<ErrorCodeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorCodeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorCodeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
