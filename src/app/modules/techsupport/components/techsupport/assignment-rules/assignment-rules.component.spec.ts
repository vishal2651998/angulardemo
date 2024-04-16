import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentRulesComponent } from './assignment-rules.component';

describe('AssignmentRulesComponent', () => {
  let component: AssignmentRulesComponent;
  let fixture: ComponentFixture<AssignmentRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignmentRulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
