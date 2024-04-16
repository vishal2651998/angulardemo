import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementWidgetsComponent } from './announcement-widgets.component';

describe('AnnouncementWidgetsComponent', () => {
  let component: AnnouncementWidgetsComponent;
  let fixture: ComponentFixture<AnnouncementWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnouncementWidgetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
