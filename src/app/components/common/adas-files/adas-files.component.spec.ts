import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdasFilesComponent } from './adas-files.component';

describe('AdasFilesComponent', () => {
  let component: AdasFilesComponent;
  let fixture: ComponentFixture<AdasFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdasFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdasFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
