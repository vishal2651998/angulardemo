import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GtsSidebarComponent } from './gts-sidebar.component';

describe('GtsSidebarComponent', () => {
  let component: GtsSidebarComponent;
  let fixture: ComponentFixture<GtsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GtsSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GtsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
