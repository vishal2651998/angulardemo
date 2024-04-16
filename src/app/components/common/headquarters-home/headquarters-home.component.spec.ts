import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadquartersHomeComponent } from './headquarters-home.component';

describe('HeadquartersHomeComponent', () => {
  let component: HeadquartersHomeComponent;
  let fixture: ComponentFixture<HeadquartersHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadquartersHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadquartersHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
