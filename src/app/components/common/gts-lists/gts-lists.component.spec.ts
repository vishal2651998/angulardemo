import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GtsListsComponent } from './gts-lists.component';

describe('GtsListsComponent', () => {
  let component: GtsListsComponent;
  let fixture: ComponentFixture<GtsListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GtsListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GtsListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
