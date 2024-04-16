import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GtsComponent } from './gts.component';

describe('GtsComponent', () => {
  let component: GtsComponent;
  let fixture: ComponentFixture<GtsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
