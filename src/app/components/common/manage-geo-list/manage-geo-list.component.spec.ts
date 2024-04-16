import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGeoListComponent } from './manage-geo-list.component';

describe('ManageGeoListComponent', () => {
  let component: ManageGeoListComponent;
  let fixture: ComponentFixture<ManageGeoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageGeoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGeoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
