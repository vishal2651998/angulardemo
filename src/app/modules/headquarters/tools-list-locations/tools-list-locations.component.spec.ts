import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsListLocationsComponent } from './tools-list-locations.component';

describe('ToolsListLocationsComponent', () => {
  let component: ToolsListLocationsComponent;
  let fixture: ComponentFixture<ToolsListLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolsListLocationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsListLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
