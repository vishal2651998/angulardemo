import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNewComponent } from './manage-new.component';

describe('ManageNewComponent', () => {
  let component: ManageNewComponent;
  let fixture: ComponentFixture<ManageNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
