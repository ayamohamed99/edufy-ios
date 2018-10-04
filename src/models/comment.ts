export class Comment {
  public id: number;
  public studentId: number;
  public classId: number;
  public comment: string;
  public senderType: string;
  public senderId: number;
  public postDate: number;
  public deleted: boolean;
  public approved: boolean;
  public dailyReportDate: string;
}
