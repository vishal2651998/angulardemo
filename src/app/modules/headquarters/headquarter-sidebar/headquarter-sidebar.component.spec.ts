import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadquarterSidebarComponent } from './headquarter-sidebar.component';

describe('HeadquarterSidebarComponent', () => {
  let component: HeadquarterSidebarComponent;
  let fixture: ComponentFixture<HeadquarterSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadquarterSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadquarterSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
