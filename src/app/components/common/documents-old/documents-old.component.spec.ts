import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsOldComponent } from './documents-old.component';

describe('DocumentsOldComponent', () => {
  let component: DocumentsOldComponent;
  let fixture: ComponentFixture<DocumentsOldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsOldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
