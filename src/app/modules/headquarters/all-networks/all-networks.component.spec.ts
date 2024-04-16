import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllNetworksComponent } from './all-networks.component';

describe('AllNetworksComponent', () => {
  let component: AllNetworksComponent;
  let fixture: ComponentFixture<AllNetworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllNetworksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllNetworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
