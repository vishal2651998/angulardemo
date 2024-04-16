import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryPhonenumberComponent } from './country-phonenumber.component';

describe('CountryPhonenumberComponent', () => {
  let component: CountryPhonenumberComponent;
  let fixture: ComponentFixture<CountryPhonenumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryPhonenumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryPhonenumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
