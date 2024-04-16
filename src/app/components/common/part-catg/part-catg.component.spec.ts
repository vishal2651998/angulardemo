import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartCatgComponent } from './part-catg.component';

describe('PartCatgComponent', () => {
  let component: PartCatgComponent;
  let fixture: ComponentFixture<PartCatgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartCatgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartCatgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
