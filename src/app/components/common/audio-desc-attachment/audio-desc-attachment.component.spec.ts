import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioDescAttachmentComponent } from './audio-desc-attachment.component';

describe('AudioDescAttachmentComponent', () => {
  let component: AudioDescAttachmentComponent;
  let fixture: ComponentFixture<AudioDescAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudioDescAttachmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioDescAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
