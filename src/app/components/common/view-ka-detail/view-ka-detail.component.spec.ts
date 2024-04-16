import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewKaDetailComponent } from './view-ka-detail.component';

describe('ViewKaDetailComponent', () => {
  let component: ViewKaDetailComponent;
  let fixture: ComponentFixture<ViewKaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewKaDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewKaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
