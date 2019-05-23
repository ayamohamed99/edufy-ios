import {Directive, DoCheck, ElementRef, Renderer2} from '@angular/core';

/**
 * Generated class for the ShimmerLoadingDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[shimmer-loading]' // Attribute selector
})
export class ShimmerLoadingDirective implements DoCheck {

  currentWidth = 0;
  currentHeight = 0;

  constructor(private renderer: Renderer2, private el: ElementRef) {

  }

  ngDoCheck(): void {
    const width = this.el.nativeElement.clientWidth;
    const height = this.el.nativeElement.clientHeight;
    if (width != this.currentWidth || height != this.currentHeight) {
      this.currentWidth = width;
      this.currentHeight = height;
      this.renderer.addClass(this.el.nativeElement, 'shimmer-loading');
      this.el.nativeElement.innerText = '';
      this.el.nativeElement.src = '';
      this.renderer.setStyle(this.el.nativeElement, 'width', width + 'px');
      this.renderer.setStyle(this.el.nativeElement, 'height', height + 'px');
      this.renderer.setStyle(this.el.nativeElement, 'background', '#f6f7f8');
      this.renderer.setStyle(this.el.nativeElement, 'background-image', '-webkit-linear-gradient(right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%)');
      this.renderer.setStyle(this.el.nativeElement, 'background-image', 'linear-gradient(right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%)');
      this.renderer.setStyle(this.el.nativeElement, 'background-repeat', 'no-repeat');
      this.el.nativeElement.animate([
        // keyframes
        {backgroundPosition: -width + 'px'},
        {backgroundPosition: width + 'px'}
      ], {
        // timing options
        duration: 1700,
        iterations: Infinity,
        easing: 'linear'
      });
    }
  }
}


