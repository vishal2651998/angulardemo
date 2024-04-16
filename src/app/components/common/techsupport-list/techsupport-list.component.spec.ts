import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechsupportListComponent } from './techsupport-list.component';

describe('TechsupportListComponent', () => {
  let component: TechsupportListComponent;
  let fixture: ComponentFixture<TechsupportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechsupportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechsupportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
