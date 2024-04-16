import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmsSmsModalComponent } from './dms-sms-modal.component';

describe('DmsSmsModalComponent', () => {
  let component: DmsSmsModalComponent;
  let fixture: ComponentFixture<DmsSmsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmsSmsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmsSmsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
