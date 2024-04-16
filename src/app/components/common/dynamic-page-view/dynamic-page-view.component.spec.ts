import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPageViewComponent } from './dynamic-page-view.component';

describe('DynamicPageViewComponent', () => {
  let component: DynamicPageViewComponent;
  let fixture: ComponentFixture<DynamicPageViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicPageViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicPageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
