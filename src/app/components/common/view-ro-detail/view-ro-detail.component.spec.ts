import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRoDetailComponent } from './view-ro-detail.component';

describe('ViewRoDetailComponent', () => {
  let component: ViewRoDetailComponent;
  let fixture: ComponentFixture<ViewRoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRoDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
