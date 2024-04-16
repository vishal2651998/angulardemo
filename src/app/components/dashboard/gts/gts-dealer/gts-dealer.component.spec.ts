import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GtsDealerComponent } from './gts-dealer.component';

describe('GtsDealerComponent', () => {
  let component: GtsDealerComponent;
  let fixture: ComponentFixture<GtsDealerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GtsDealerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GtsDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
