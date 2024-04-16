import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAccordionTabComponent } from './custom-accordion-tab.component';

describe('CustomAccordionTabComponent', () => {
  let component: CustomAccordionTabComponent;
  let fixture: ComponentFixture<CustomAccordionTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomAccordionTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAccordionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
