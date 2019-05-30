import {NgModule} from '@angular/core';
import {ShimmerLoadingDirective} from './shimmer-loading/shimmer-loading';
import {AutoresizeDirective} from './autoresize/autoresize';
import {ScrollVanishDirective} from './scroll-vanish/scroll-vanish.directive';

@NgModule({
  declarations: [ShimmerLoadingDirective,
    AutoresizeDirective,
    ScrollVanishDirective],
  imports: [],
  exports: [ShimmerLoadingDirective,
    AutoresizeDirective,ScrollVanishDirective]
})
export class DirectivesModule {
}
