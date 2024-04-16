import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicAttachmentViewComponent } from './dynamic-attachment-view.component';

describe('DynamicAttachmentViewComponent', () => {
  let component: DynamicAttachmentViewComponent;
  let fixture: ComponentFixture<DynamicAttachmentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicAttachmentViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicAttachmentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
