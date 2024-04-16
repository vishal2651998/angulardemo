import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDomainDetailComponent } from './service-domain-detail.component';

describe('ServiceDomainDetailComponent', () => {
  let component: ServiceDomainDetailComponent;
  let fixture: ComponentFixture<ServiceDomainDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceDomainDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDomainDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
