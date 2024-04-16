import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPublisherComponent } from './app-publisher.component';

describe('AppPublisherComponent', () => {
  let component: AppPublisherComponent;
  let fixture: ComponentFixture<AppPublisherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppPublisherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPublisherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
