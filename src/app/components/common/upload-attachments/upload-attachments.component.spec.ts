import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAttachmentsComponent } from './upload-attachments.component';

describe('UploadAttachmentsComponent', () => {
  let component: UploadAttachmentsComponent;
  let fixture: ComponentFixture<UploadAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadAttachmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
