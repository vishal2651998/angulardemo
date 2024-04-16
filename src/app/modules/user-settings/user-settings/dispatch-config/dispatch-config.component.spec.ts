import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchConfigComponent } from './dispatch-config.component';

describe('DispatchConfigComponent', () => {
  let component: DispatchConfigComponent;
  let fixture: ComponentFixture<DispatchConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
