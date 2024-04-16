import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedKzListComponent } from './approved-kz-list.component';

describe('ApprovedKzListComponent', () => {
  let component: ApprovedKzListComponent;
  let fixture: ComponentFixture<ApprovedKzListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedKzListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedKzListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
