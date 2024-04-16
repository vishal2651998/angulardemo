import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KzListComponent } from './kz-list.component';

describe('KzListComponent', () => {
  let component: KzListComponent;
  let fixture: ComponentFixture<KzListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KzListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KzListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
