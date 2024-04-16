import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPinnedContentComponent } from './my-pinned-content.component';

describe('MyPinnedContentComponent', () => {
  let component: MyPinnedContentComponent;
  let fixture: ComponentFixture<MyPinnedContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyPinnedContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPinnedContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
