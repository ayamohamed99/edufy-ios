import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDialoguePage } from './chat-dialogue.page';

describe('ChatDialoguePage', () => {
  let component: ChatDialoguePage;
  let fixture: ComponentFixture<ChatDialoguePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatDialoguePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatDialoguePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
