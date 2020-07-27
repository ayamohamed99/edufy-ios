import {Component, OnInit, ViewChild} from '@angular/core';
import {StudentsService} from '../../services/Students/students.service';
import {AlertController, ModalController, NavParams, Platform} from '@ionic/angular';
import {ChatService} from '../../services/Chat/chat.service';
import {Student} from '../../models';
import {Storage} from '@ionic/storage';
import {ChatDialoguePage} from '../chat-dialogue/chat-dialogue.page';
import {PassDataService} from '../../services/pass-data.service';

@Component({
  selector: "app-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"],
})
export class ChatPage implements OnInit {
  @ViewChild("LastOpenedContainer", { static: false })
  private LastOpenedContainer: any;
  recentChatKey = "LOCAL_STORAGE_RECENT_CHAT";
  allStudents: any = [];
  lastStudents: any = [];
  MAIN_STUDENTS_ARRAY: any[] = [];
  loading = false;

  constructor(
    public studentServ: StudentsService,
    public platform: Platform,
    private storage: Storage,
    public alrt: AlertController,
    public modalCtrl: ModalController,
    public chatServ: ChatService,
    public passData: PassDataService
  ) {
    if (platform.is("desktop")) {
      studentServ.putHeader(localStorage.getItem("LOCAL_STORAGE_TOKEN"));
      this.getChatStudent();
      let recentChat = localStorage.getItem(this.recentChatKey);
      if (recentChat) {
        this.lastStudents = JSON.parse(recentChat);
      }
      chatServ.putHeader(localStorage.getItem("LOCAL_STORAGE_TOKEN"));
      this.getNewChat();
    } else {
      storage.get("LOCAL_STORAGE_TOKEN").then((val) => {
        studentServ.putHeader(val);
        this.getChatStudent();
        chatServ.putHeader(val);
        storage.get(this.recentChatKey).then((val) => {
          if (val) {
            this.lastStudents = JSON.parse(val);
          }
          this.getNewChat();
        });
      });
    }

    let data = this.chatServ.NewChats;
    for (let message of data) {
      let Stud = new Student();
      Stud.id = message.chatThread.student.id;
      Stud.name = message.chatThread.student.name;
      Stud.address = message.chatThread.student.address;
      Stud.classes = message.chatThread.student.classes;
      Stud.profileImg = message.chatThread.student.profileImg;
      Stud.searchByClassGrade =
        message.chatThread.student.classes.grade.name +
        " " +
        message.chatThread.student.classes.name;
      if (
        !this.lastStudents.some(
          (value) => value.id == message.chatThread.student.id
        )
      ) {
        this.lastStudents.push(Stud);
      }
    }
    this.chatServ.NewChats = [];
  }

  ngOnInit() {}

  onSearchInput(event) {
    // set val to the value of the searchbar
    const val = event.target.value;
    console.log("Search" + val);

    // if the value is an empty string don't filter the items
    if (val && val.trim() != "") {
      this.allStudents = [];
      for (let j = 0; j < this.MAIN_STUDENTS_ARRAY.length; j++) {
        let studentName = this.MAIN_STUDENTS_ARRAY[j].name.toLowerCase();
        let studentClassGrade = this.MAIN_STUDENTS_ARRAY[
          j
        ].searchByClassGrade.toLowerCase();
        let searchValue = val.toLowerCase();
        if (
          studentName.indexOf(searchValue) > -1 ||
          studentClassGrade.indexOf(searchValue) > -1
        ) {
          this.allStudents.push(this.MAIN_STUDENTS_ARRAY[j]);
        }
      }
    } else {
      this.allStudents = [];
      this.allStudents = this.MAIN_STUDENTS_ARRAY.map((value) => {
        return { ...value };
      });
    }
  }

  onSearchCancel(event) {
    const val = event.target.value;
    console.log("Search" + val);
    this.allStudents = this.MAIN_STUDENTS_ARRAY.map((value) => {
      return { ...value };
    });
  }

  getChatStudent() {
    this.loading = true;
    this.studentServ.getAllStudents(7, null).subscribe(
      (value) => {
        this.loading = false;
        console.log(value);
        let Data: any = value;
        // if(this.platform.is('cordova')){
        //   Data = JSON.parse(value.data);
        // }
        for (let student of Data) {
          let Stud = new Student();
          Stud.id = student.id;
          Stud.name = student.name;
          Stud.address = student.address;
          Stud.classes = student.classes;
          Stud.profileImg = student.profileImg;
          Stud.searchByClassGrade =
            student.classes.grade.name + " " + student.classes.name;
          this.allStudents.push(Stud);
          this.MAIN_STUDENTS_ARRAY.push(Stud);
        }
      },
      (error2) => {
        this.loading = false;
        this.errorGetStudentAlert();
        console.log(error2);
      }
    );
  }

  async errorGetStudentAlert() {
    const alert = await this.alrt.create({
      subHeader: "An Error happen when try to get your students!",
      buttons: [
        {
          text: "Retry",
          handler: () => {
            this.getChatStudent();
          },
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });
    await alert.present();
  }

  getFristName(Name) {
    let FIRST_NAME: string;
    try {
      let arrayName = Name.split(" ");
      FIRST_NAME = arrayName[0];
    } catch (e) {
      FIRST_NAME = Name;
    }
    return FIRST_NAME;
  }

  async openDialog(student, index, From) {
    let data = { studentData: student };

    this.passData.dataToPass = data;

    const modal = await this.modalCtrl.create({
      component: ChatDialoguePage,
      componentProps: data,
    });

    modal.onDidDismiss().then((data) => {
      this.viewListsEffect(student, index, From);
      this.checkDataStudents();
    });
    modal.present();
  }

  viewListsEffect(student, index, From) {
    let findStudent = this.lastStudents.some((value) => value.id == student.id);
    if (!findStudent && index == -1 && From == "All") {
      this.lastStudents.splice(0, 0, student);
    } else if (findStudent && index == -1 && From == "All") {
      for (let i = 0; i < this.lastStudents.length; i++) {
        if (student.id == this.lastStudents[i].id) {
          try {
            this.LastOpenedContainer.nativeElement.scrollLeft = 0;
          } catch (err) {}
          this.lastStudents.splice(i, 1);
          this.lastStudents.splice(0, 0, student);
        }
      }
    } else if (index > -1 && From == "Last") {
      try {
        this.LastOpenedContainer.nativeElement.scrollLeft = 0;
      } catch (err) {}
      this.lastStudents.splice(index, 1);
      this.lastStudents.splice(0, 0, student);
    } else if (index == -1 && From == "server") {
      let found = false;
      for (let i = 0; i < this.lastStudents.length; i++) {
        if (student.id == this.lastStudents[i].id) {
          try {
            this.LastOpenedContainer.nativeElement.scrollLeft = 0;
          } catch (err) {}
          this.lastStudents.splice(i, 1);
          this.lastStudents.splice(0, 0, student);
          found = true;
        }
      }

      if (!found) {
        this.lastStudents.splice(0, 0, student);
      }
    }

    if (this.platform.is("desktop")) {
      localStorage.setItem(
        this.recentChatKey,
        JSON.stringify(this.lastStudents)
      );
    } else {
      this.storage.set(this.recentChatKey, JSON.stringify(this.lastStudents));
    }
  }

  checkDataStudents() {
    for (let message of this.chatServ.NewChats) {
      let Stud = new Student();
      Stud.id = message.chatThread.student.id;
      Stud.name = message.chatThread.student.name;
      Stud.address = message.chatThread.student.address;
      Stud.classes = message.chatThread.student.classes;
      Stud.profileImg = message.chatThread.student.profileImg;
      Stud.searchByClassGrade =
        message.chatThread.student.classes.grade.name +
        " " +
        message.chatThread.student.classes.name;
      if (
        !this.lastStudents.some(
          (value) => value.id == message.chatThread.student.id
        )
      ) {
        this.lastStudents.splice(0, 0, Stud);
      } else {
        for (let i = 0; i < this.lastStudents.length; i++) {
          if (message.chatThread.student.id == this.lastStudents[i].id) {
            this.lastStudents.splice(i, 1);
            Stud.id = message.chatThread.student.id;
            Stud.name = message.chatThread.student.name;
            Stud.address = message.chatThread.student.address;
            Stud.classes = message.chatThread.student.classes;
            Stud.profileImg = message.chatThread.student.profileImg;
            Stud.searchByClassGrade =
              message.chatThread.student.classes.grade.name +
              " " +
              message.chatThread.student.classes.name;
            this.lastStudents.splice(0, 0, Stud);
            try {
              this.LastOpenedContainer.nativeElement.scrollLeft = 0;
            } catch (err) {}
          }
        }
      }
    }
  }

  getNewChat() {
    this.chatServ.getNewMessages().subscribe(
      // @ts-ignore
      (val) => {
        let values: any = [];
        values = val;
        // if(this.platform.is('cordova')){
        //   values = JSON.parse(val.data);
        // }
        if (values.length > 0) {
          for (let data of values) {
            let stu: any = this.studentServ.findStudentByID(
              data.senderId,
              this.MAIN_STUDENTS_ARRAY
            );
            this.viewListsEffect(stu, -1, "server");
          }
        }
      },
      (err) => {
        console.log("cant get recent chat from server");
        console.log(err);
      }
    );
  }
}
