import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadquartersListComponent } from './headquarters-list.component';

describe('HeadquartersListComponent', () => {
  let component: HeadquartersListComponent;
  let fixture: ComponentFixture<HeadquartersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadquartersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadquartersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
