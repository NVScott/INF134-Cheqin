import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPage } from './daily.page';

describe('DailyPage', () => {
  let component: DailyPage;
  let fixture: ComponentFixture<DailyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
