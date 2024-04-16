import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementUserViewComponent } from './announcement-user-view.component';

describe('AnnouncementUserViewComponent', () => {
  let component: AnnouncementUserViewComponent;
  let fixture: ComponentFixture<AnnouncementUserViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnouncementUserViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementUserViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
