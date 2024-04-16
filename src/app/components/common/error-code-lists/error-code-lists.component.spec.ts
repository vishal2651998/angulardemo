import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorCodeListsComponent } from './error-code-lists.component';

describe('ErrorCodeListsComponent', () => {
  let component: ErrorCodeListsComponent;
  let fixture: ComponentFixture<ErrorCodeListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorCodeListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorCodeListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
