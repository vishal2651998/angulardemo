import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainUrlComponent } from './domain-url.component';

describe('DomainUrlComponent', () => {
  let component: DomainUrlComponent;
  let fixture: ComponentFixture<DomainUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainUrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
