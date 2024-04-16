import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GtsSampleComponent } from './runtime-gts-view-question.component';

describe('GtsSampleComponent', () => {
  let component: GtsSampleComponent;
  let fixture: ComponentFixture<GtsSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GtsSampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GtsSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
