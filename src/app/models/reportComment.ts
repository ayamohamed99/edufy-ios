export class ReportComment {
  public id: number;
  public studentId: number;
  public classId: number;
  public comment: string;
  public senderObject: SenderObject;
  public senderType: string;
  public senderId: number;
  public postDate: number;
  public deleted: boolean;
  public approved: boolean;
  public dailyReportDate: string;
  public awaiting = false;
  animationStatus = 'loaded';
}

export interface SenderObject {
    id?: number;
    name?: string;
    type?: string;
    profileImg?: string;
}
