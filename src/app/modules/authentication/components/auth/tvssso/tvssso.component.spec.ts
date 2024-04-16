import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvsssoComponent } from './tvssso.component';

describe('TvsssoComponent', () => {
  let component: TvsssoComponent;
  let fixture: ComponentFixture<TvsssoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TvsssoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TvsssoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
