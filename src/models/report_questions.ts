import {DailyReportQuestionType} from "./dailyReportQuestionType";

export class ReportQuestions{
  dailyReportQuestionType = new DailyReportQuestionType();
  editQuestion = false;
  id;
  isEdited = false;
  parametersList = [];
  question;
  questionNumber = 0;
}
