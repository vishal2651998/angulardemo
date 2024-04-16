import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecWorkstreamsComponent } from './sec-workstreams.component';

describe('SecWorkstreamsComponent', () => {
  let component: SecWorkstreamsComponent;
  let fixture: ComponentFixture<SecWorkstreamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecWorkstreamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecWorkstreamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
