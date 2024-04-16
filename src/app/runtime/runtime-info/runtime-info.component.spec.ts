import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuntimeInfoComponent } from './runtime-info.component';

describe('RuntimeInfoComponent', () => {
  let component: RuntimeInfoComponent;
  let fixture: ComponentFixture<RuntimeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RuntimeInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuntimeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
