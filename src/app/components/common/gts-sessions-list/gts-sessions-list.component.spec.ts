import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GtsSessionsListComponent } from './gts-sessions-list.component';

describe('GtsSessionsListComponent', () => {
  let component: GtsSessionsListComponent;
  let fixture: ComponentFixture<GtsSessionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GtsSessionsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GtsSessionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
