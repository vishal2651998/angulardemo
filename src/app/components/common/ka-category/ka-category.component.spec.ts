import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaCategoryComponent } from './ka-category.component';

describe('KaCategoryComponent', () => {
  let component: KaCategoryComponent;
  let fixture: ComponentFixture<KaCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
