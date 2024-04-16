import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportOptionComponent } from './export-option.component';

describe('ExportOptionComponent', () => {
  let component: ExportOptionComponent;
  let fixture: ComponentFixture<ExportOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
