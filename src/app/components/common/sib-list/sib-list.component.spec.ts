import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SibListComponent } from './sib-list.component';

describe('SibListComponent', () => {
  let component: SibListComponent;
  let fixture: ComponentFixture<SibListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SibListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SibListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
