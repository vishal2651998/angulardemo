import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProbingComponent } from './service-probing.component';

describe('ServiceProbingComponent', () => {
  let component: ServiceProbingComponent;
  let fixture: ComponentFixture<ServiceProbingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceProbingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceProbingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
