import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPublicComponent } from '../view-public/view-public.component';

describe('ViewPublicComponent', () => {
  let component: ViewPublicComponent;
  let fixture: ComponentFixture<ViewPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPublicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
