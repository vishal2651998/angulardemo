import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SibComponent } from './sib.component';

describe('SibComponent', () => {
  let component: SibComponent;
  let fixture: ComponentFixture<SibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SibComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
