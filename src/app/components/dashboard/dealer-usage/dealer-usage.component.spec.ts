import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerUsageComponent } from './dealer-usage.component';

describe('DealerUsageComponent', () => {
  let component: DealerUsageComponent;
  let fixture: ComponentFixture<DealerUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
