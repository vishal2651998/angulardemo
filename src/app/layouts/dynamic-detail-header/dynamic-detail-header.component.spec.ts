import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDetailHeaderComponent } from './dynamic-detail-header.component';

describe('DynamicDetailHeaderComponent', () => {
  let component: DynamicDetailHeaderComponent;
  let fixture: ComponentFixture<DynamicDetailHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicDetailHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicDetailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
