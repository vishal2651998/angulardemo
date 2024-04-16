import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowedDomainsComponent } from './allowed-domains.component';

describe('AllowedDomainsComponent', () => {
  let component: AllowedDomainsComponent;
  let fixture: ComponentFixture<AllowedDomainsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllowedDomainsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowedDomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
