import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainMembersComponent } from './domain-members.component';

describe('DomainMembersComponent', () => {
  let component: DomainMembersComponent;
  let fixture: ComponentFixture<DomainMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
