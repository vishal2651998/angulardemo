import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProviderFooterComponent } from './service-provider-footer.component';

describe('ServiceProviderFooterComponent', () => {
  let component: ServiceProviderFooterComponent;
  let fixture: ComponentFixture<ServiceProviderFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceProviderFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceProviderFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
