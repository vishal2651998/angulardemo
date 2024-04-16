import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDocumentDetailComponent } from './view-document-detail.component';

describe('ViewDocumentDetailComponent', () => {
  let component: ViewDocumentDetailComponent;
  let fixture: ComponentFixture<ViewDocumentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDocumentDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDocumentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
