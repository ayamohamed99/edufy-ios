import {NgModule} from '@angular/core';
import {ShimmerLoadingDirective} from './shimmer-loading/shimmer-loading';
import {AutoresizeDirective} from './autoresize/autoresize';

@NgModule({
  declarations: [ShimmerLoadingDirective,
    AutoresizeDirective],
  imports: [],
  exports: [ShimmerLoadingDirective,
    AutoresizeDirective]
})
export class DirectivesModule {
}
