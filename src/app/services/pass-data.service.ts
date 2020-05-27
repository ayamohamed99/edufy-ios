import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PassDataService {

  private _dataToPass;

  constructor() { }


  get dataToPass() {
    return this._dataToPass;
  }

  set dataToPass(value) {
    this._dataToPass = value;
  }
}
