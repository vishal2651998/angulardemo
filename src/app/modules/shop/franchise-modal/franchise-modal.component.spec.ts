import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FranchiseModalComponent } from './franchise-modal.component';

describe('FranchiseModalComponent', () => {
  let component: FranchiseModalComponent;
  let fixture: ComponentFixture<FranchiseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FranchiseModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FranchiseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
