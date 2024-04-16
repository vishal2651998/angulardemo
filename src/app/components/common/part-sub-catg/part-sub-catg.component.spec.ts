import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartSubCatgComponent } from './part-sub-catg.component';

describe('PartSubCatgComponent', () => {
  let component: PartSubCatgComponent;
  let fixture: ComponentFixture<PartSubCatgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartSubCatgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartSubCatgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
