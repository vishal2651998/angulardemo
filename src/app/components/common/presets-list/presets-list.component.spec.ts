import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresetsListComponent } from './presets-list.component';

describe('PresetsListComponent', () => {
  let component: PresetsListComponent;
  let fixture: ComponentFixture<PresetsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresetsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
