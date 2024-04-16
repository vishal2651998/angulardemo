import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugFeaDetailsComponent } from './bug-fea-details.component';

describe('BugFeaDetailsComponent', () => {
  let component: BugFeaDetailsComponent;
  let fixture: ComponentFixture<BugFeaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BugFeaDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BugFeaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
