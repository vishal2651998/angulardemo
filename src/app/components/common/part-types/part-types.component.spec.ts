import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartTypesComponent } from './part-types.component';

describe('PartTypesComponent', () => {
  let component: PartTypesComponent;
  let fixture: ComponentFixture<PartTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
