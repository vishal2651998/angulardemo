import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadquarterToolsAndEquipmentsComponent } from './headquarter-tools-and-equipments.component';

describe('HeadquarterToolsAndEquipmentsComponent', () => {
  let component: HeadquarterToolsAndEquipmentsComponent;
  let fixture: ComponentFixture<HeadquarterToolsAndEquipmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadquarterToolsAndEquipmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadquarterToolsAndEquipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
