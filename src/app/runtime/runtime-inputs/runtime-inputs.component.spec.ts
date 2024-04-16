import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuntimeInputsComponent } from './runtime-inputs.component';

describe('RuntimeInputsComponent', () => {
  let component: RuntimeInputsComponent;
  let fixture: ComponentFixture<RuntimeInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RuntimeInputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuntimeInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
