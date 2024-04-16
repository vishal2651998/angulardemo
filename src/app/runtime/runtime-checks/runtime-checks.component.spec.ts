import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuntimeChecksComponent } from './runtime-checks.component';

describe('RuntimeChecksComponent', () => {
  let component: RuntimeChecksComponent;
  let fixture: ComponentFixture<RuntimeChecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RuntimeChecksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuntimeChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
