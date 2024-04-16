import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEditHeaderComponent } from './new-edit-header.component';

describe('NewEditHeaderComponent', () => {
  let component: NewEditHeaderComponent;
  let fixture: ComponentFixture<NewEditHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEditHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEditHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
