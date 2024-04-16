import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechinfoproComponent } from './techinfopro.component';

describe('TechinfoproComponent', () => {
  let component: TechinfoproComponent;
  let fixture: ComponentFixture<TechinfoproComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechinfoproComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechinfoproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
