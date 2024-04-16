import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioAttachmentViewComponent } from './audio-attachment-view.component';

describe('AudioAttachmentViewComponent', () => {
  let component: AudioAttachmentViewComponent;
  let fixture: ComponentFixture<AudioAttachmentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudioAttachmentViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioAttachmentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
