import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNewManualComponent } from './manage-new-manual.component';

describe('ManageNewManualComponent', () => {
  let component: ManageNewManualComponent;
  let fixture: ComponentFixture<ManageNewManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageNewManualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageNewManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
