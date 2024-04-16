import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProviderInnerDetailComponent } from './service-provider-inner-detail.component';

describe('ServiceProviderInnerDetailComponent', () => {
  let component: ServiceProviderInnerDetailComponent;
  let fixture: ComponentFixture<ServiceProviderInnerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceProviderInnerDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceProviderInnerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
