import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConvertorIFileToFileService {

  constructor() { }

  // For some reason uploading files from ionic image picker sometimes loses type and sets it to plain/text
  // This basically is a hack but works well
  IFlieToFile(file: any): Promise<File> {
    return new Promise((resolve, reject) => {
      if (file.localURL === undefined) {
        return resolve(<File> file);
      }
      let fr = new FileReader();
      fr.readAsArrayBuffer(file);
      fr.onload = () => {
        // @ts-ignore
        resolve(<File> new Blob([new Uint8Array(fr.result)], { type: file.type }));
      }
      fr.onerror = () => {
        reject(fr.error);
      }
    });
  }

}
