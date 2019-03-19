import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import * as XLSX from 'xlsx';
import {File} from '@ionic-native/file';
import {Platform,AlertController} from 'ionic-angular';
import {FileOpener} from '@ionic-native/file-opener';

declare var window: any;

@Injectable()
export class Excel {

  constructor(private file:File,private platform:Platform,private fileOpener: FileOpener,private alrtCtrl:AlertController){

  }

  tableToExcel(tableId,worksheetName){

    // let uri='data:application/vnd.ms-excel;base64,';
    // let template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
    //
    // let table=document.getElementById(tableId),
    //   ctx={worksheet:worksheetName,table:table.innerHTML},
    //   href=uri+this.base64(this.format(template,ctx));
    // return href;

    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(tableId);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, worksheetName);
    //
    // /* save to file */
    if(!this.platform.is('core')){

      let path;
      if (this.platform.is('ios')) {
        path = this.file.documentsDirectory;
      } else if (this.platform.is('android')) {
        path = this.file.externalRootDirectory+'/Download/';
      }
      /* write a workbook */
      const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      let blob = new Blob([wbout], {type: 'application/octet-stream'});
      this.file.writeFile(path, worksheetName, blob, {replace: false});

      this.fileOpener.open(path+worksheetName, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .then(() => {})
        .catch(e => {
          let error:string;
          if(e.message.includes("Activity not found")){
            error = "There is no app to open this file";
          }else{
            error = 'Something went wrong try again later.'+JSON.stringify(e);
          }

          this.alrtCtrl.create( {
            title: 'Error',
            subTitle: error,
            buttons: ['OK']
          }).present();
        });

    }else{
      XLSX.writeFile(wb, 'Incidents.xlsx');
    }
  }


}