import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportOptionHeaderComponent } from './export-option-header.component';

describe('ExportOptionHeaderComponent', () => {
  let component: ExportOptionHeaderComponent;
  let fixture: ComponentFixture<ExportOptionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportOptionHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportOptionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
