import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveMediaComponent } from './remove-media.component';

describe('RemoveMediaComponent', () => {
  let component: RemoveMediaComponent;
  let fixture: ComponentFixture<RemoveMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
