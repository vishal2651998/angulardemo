import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTraningDetailComponent } from './view-traning-detail.component';

describe('ViewTraningDetailComponent', () => {
  let component: ViewTraningDetailComponent;
  let fixture: ComponentFixture<ViewTraningDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTraningDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTraningDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
