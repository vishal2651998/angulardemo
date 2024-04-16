import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalationsComponent } from './escalations.component';

describe('EscalationsComponent', () => {
  let component: EscalationsComponent;
  let fixture: ComponentFixture<EscalationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EscalationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EscalationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
