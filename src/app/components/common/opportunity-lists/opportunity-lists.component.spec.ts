import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityListsComponent } from './opportunity-lists.component';

describe('OpportunityListsComponent', () => {
  let component: OpportunityListsComponent;
  let fixture: ComponentFixture<OpportunityListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpportunityListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
