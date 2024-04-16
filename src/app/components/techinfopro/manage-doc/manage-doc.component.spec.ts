import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDocComponent } from './manage-doc.component';

describe('ManageDocComponent', () => {
  let component: ManageDocComponent;
  let fixture: ComponentFixture<ManageDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
