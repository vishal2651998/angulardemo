import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsNewComponent } from './documents-new.component';

describe('DocumentsNewComponent', () => {
  let component: DocumentsNewComponent;
  let fixture: ComponentFixture<DocumentsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
