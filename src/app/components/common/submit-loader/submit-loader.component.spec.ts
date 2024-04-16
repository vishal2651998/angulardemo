import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubmitLoaderComponent } from './submit-loader.component';

describe('SubmitLoaderComponent', () => {
  let component: SubmitLoaderComponent;
  let fixture: ComponentFixture<SubmitLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
