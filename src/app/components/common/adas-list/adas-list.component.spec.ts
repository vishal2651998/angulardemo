import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdasListComponent } from './adas-list.component';

describe('AdasListComponent', () => {
  let component: AdasListComponent;
  let fixture: ComponentFixture<AdasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdasListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
