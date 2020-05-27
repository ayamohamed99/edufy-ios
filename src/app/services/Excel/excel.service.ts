import {Injectable} from '@angular/core';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/observable/fromPromise';
// import 'rxjs/add/operator/mergeMap';
import * as XLSX from 'xlsx';
import {File} from '@ionic-native/file/ngx';
import {Platform, AlertController} from '@ionic/angular';
import {FileOpener} from '@ionic-native/file-opener/ngx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  path;
  constructor(private file: File, private platform: Platform, private fileOpener: FileOpener, private alrtCtrl: AlertController) {
    if (this.platform.is('ios')) {
      this.path = this.file.documentsDirectory;
    } else if (this.platform.is('android')) {
      this.path = this.file.externalRootDirectory + '/Download/';
    }
  }

  tableToExcel(tableId, worksheetName) {

    // let uri='data:application/vnd.ms-excel;base64,';
    // let template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
    //
    // let table=document.getElementById(tableId),
    //   ctx={worksheet:worksheetName,table:table.innerHTML},
    //   href=uri+this.base64(this.format(template,ctx));
    // return href;

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tableId);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, worksheetName);
    //
    // /* save to file */
    if (!this.platform.is('desktop')) {

      /* write a workbook */
      const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], {type: 'application/octet-stream'});
      this.file.writeFile(this.path, worksheetName, blob, {replace: true}).then(
          val => {
            this.fileOpener.open(this.path + worksheetName, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                .then(() => {})
                .catch(e => {
                  let error: string;
                  if (e.message.includes('Activity not found')) {
                    error = 'There is no app to open this file';
                  } else {
                    error = 'Something went wrong try again later.' + JSON.stringify(e);
                  }

                  this.presentAlert(error);
                });
          })
          .catch(err => {
            this.presentAlert(err);
          });

    } else {
      XLSX.writeFile(wb, 'Incidents.xlsx');
    }
  }


  async presentAlert(err) {
    const alert = await this.alrtCtrl.create({
      header: 'Error',
      message: err,
      buttons: ['OK']
    });

    await alert.present();
  }
}
