import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionsComponent } from './inpsections.component';

describe('InspectionsComponent', () => {
  let component: InspectionsComponent;
  let fixture: ComponentFixture<InspectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
