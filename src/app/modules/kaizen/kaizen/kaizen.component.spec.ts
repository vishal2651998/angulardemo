import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaizenComponent } from './kaizen.component';

describe('KaizenComponent', () => {
  let component: KaizenComponent;
  let fixture: ComponentFixture<KaizenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaizenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaizenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
