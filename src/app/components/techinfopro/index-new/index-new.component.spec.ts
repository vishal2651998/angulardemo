import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexNewComponent } from './index-new.component';

describe('IndexNewComponent', () => {
  let component: IndexNewComponent;
  let fixture: ComponentFixture<IndexNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
