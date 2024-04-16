import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAnnouncementDetailComponent } from './view-announcement-detail.component';

describe('ViewAnnouncementDetailComponent', () => {
  let component: ViewAnnouncementDetailComponent;
  let fixture: ComponentFixture<ViewAnnouncementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAnnouncementDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAnnouncementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
