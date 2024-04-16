import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SibApplicationComponent } from './sib-application.component';

describe('SibApplicationComponent', () => {
  let component: SibApplicationComponent;
  let fixture: ComponentFixture<SibApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SibApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SibApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
