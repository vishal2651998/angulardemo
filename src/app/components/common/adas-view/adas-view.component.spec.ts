import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdasViewComponent } from './adas-view.component';

describe('AdasViewComponent', () => {
  let component: AdasViewComponent;
  let fixture: ComponentFixture<AdasViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdasViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdasViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
