import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllNetworksListComponent } from './all-networks-list.component';

describe('AllNetworksListComponent', () => {
  let component: AllNetworksListComponent;
  let fixture: ComponentFixture<AllNetworksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllNetworksListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllNetworksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
