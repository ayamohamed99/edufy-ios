import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import {Ng2ImgMaxService} from "ng2-img-max";
import {DomSanitizer} from "@angular/platform-browser";

@Injectable()
export class ImageCompressorService{

  constructor(private ng2ImgMax: Ng2ImgMaxService,public sanitizer: DomSanitizer){}

  compressImage(image){
    return this.ng2ImgMax.resizeImage(image, 1024, 1024);
  }

}
