import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckboxFunctionService {

  convert_SelectedItemArray_To_CheckListObject(selectedItemArray) {
    let checkListArray = {};
    for (let i = 0; i < selectedItemArray.length; i++) {
      checkListArray[selectedItemArray[i].id] = true;
    }

    return checkListArray;
  }

  convert_CheckListObject_To_SelectedItemArray(checkListObject, fullItemArray) {
    let selectedItemArray = [];

    for (let i = 0; i < fullItemArray.length; i++) {
      if (checkListObject[fullItemArray[i].id] && checkListObject[fullItemArray[i].id] === true) {
        let item = {id: fullItemArray[i].id};
        selectedItemArray.push(item);
      }
    }

    return selectedItemArray;
  }

  convert_CheckListObject_To_DailyReportAnswer(checkListObject, fullItemArray) {
    let selectedItemArray = [];
    let firstTime = true;
    let textAnswer = '';
    let idAnswer = '';
    for (let i = 0; i < fullItemArray.length; i++) {
      if (checkListObject[fullItemArray[i].id] && checkListObject[fullItemArray[i].id] === true) {
        if (firstTime) {
          textAnswer += fullItemArray[i].value;
          idAnswer += fullItemArray[i].id;
          firstTime = false;
        } else {
          textAnswer += '$$' + fullItemArray[i].value;
          idAnswer += '$$' + fullItemArray[i].id;
        }
      }
    }

    return textAnswer + '||' + idAnswer;
  }
}
