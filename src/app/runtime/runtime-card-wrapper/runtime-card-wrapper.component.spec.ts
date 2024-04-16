import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuntimeCardWrapperComponent } from './runtime-card-wrapper.component';

describe('RuntimeCardWrapperComponent', () => {
  let component: RuntimeCardWrapperComponent;
  let fixture: ComponentFixture<RuntimeCardWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RuntimeCardWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuntimeCardWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
