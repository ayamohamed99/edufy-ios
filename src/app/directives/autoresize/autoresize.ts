// An autoresize directive that works with ion-textarea in Ionic 2
// Usage example: <ion-textarea autoresize [(ngModel)]="body"></ion-textarea>
// Usage example: <ion-textarea autoresize="100" [(ngModel)]="body"></ion-textarea>
// Based on https://www.npmjs.com/package/angular2-autosize
import {AfterViewChecked, Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';

@Directive({
  selector: 'ion-textarea[autoresize]' // Attribute selector
})
export class AutoresizeDirective implements OnInit, AfterViewChecked {

  @Input('autoresize') maxHeight: number;

  constructor(public element: ElementRef) {
  }

  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.adjust();
  }

  ngOnInit(): void {
    this.adjust();
  }

  ngAfterViewChecked(): void {
    this.adjust();
  }

  adjust(): void {
    let ta = this.element.nativeElement.querySelector('textarea'),
      newHeight;

    if (ta) {
      ta.style.overflow = 'hidden';
      ta.style.height = '';
      if (this.maxHeight) {
        newHeight = Math.min(ta.scrollHeight, this.maxHeight);
      } else {
        newHeight = ta.scrollHeight;
      }
      ta.style.height = newHeight + 'px';
      ta.style.margin = 0;
      ta.style.padding = '4px';
    }
  }


}
