import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushConfigComponent } from './push-config.component';

describe('PushConfigComponent', () => {
  let component: PushConfigComponent;
  let fixture: ComponentFixture<PushConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PushConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PushConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
