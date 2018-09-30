import {Injectable} from "@angular/core";

@Injectable()
export class CheckboxFunctionService{


  convert_SelectedItemArray_To_CheckListObject(selectedItemArray) {
    var checkListArray = {};
    for (var i = 0; i < selectedItemArray.length; i++) {
      checkListArray[selectedItemArray[i].id] = true;
    }

    return checkListArray;
  }

  convert_CheckListObject_To_SelectedItemArray (checkListObject, fullItemArray) {
    var selectedItemArray = [];

    for (var i = 0; i < fullItemArray.length; i++) {
      if (checkListObject[fullItemArray[i].id] && checkListObject[fullItemArray[i].id] === true) {
        var item = {"id": fullItemArray[i].id};
        selectedItemArray.push(item);
      }
    }

    return selectedItemArray;
  }

  convert_CheckListObject_To_DailyReportAnswer (checkListObject, fullItemArray) {
    var selectedItemArray = [];
    var firstTime = true;
    var textAnswer = "";
    var idAnswer = "";
    for (var i = 0; i < fullItemArray.length; i++) {
      if (checkListObject[fullItemArray[i].id] && checkListObject[fullItemArray[i].id] === true) {
        if (firstTime) {
          textAnswer += fullItemArray[i].value;
          idAnswer += fullItemArray[i].id;
          firstTime = false;
        } else {
          textAnswer += "$$" + fullItemArray[i].value;
          idAnswer += "$$" + fullItemArray[i].id;
        }
      }
    }

    return textAnswer + "||" + idAnswer;
  }


}
