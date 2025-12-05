import { Component, ElementRef, signal, ViewChild, WritableSignal } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  userIsConnected : boolean = false;
  @ViewChild("photo", {static : false}) myPicture ?: ElementRef;
  // Vous êtes obligés d'utiliser ces trois propriétés
  oldPassword : string = "";
  newPassword : string = "";
  newPasswordConfirm : string = "";
  
  username : string | null = null;

  imageSrc = "/assets/images/default.png";

  constructor(public userService : UserService) { }

  ngOnInit() {
    this.userIsConnected = localStorage.getItem("token") != null;
    this.username = localStorage.getItem("username");
    
  }

  imgFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.imageSrc = URL.createObjectURL(event.target.files[0]);
    }
  }

  async edit()
  {
    let file = null;
    if(this.myPicture != null) {
      file = this.myPicture.nativeElement.files[0];
    }
    
    if(this.oldPassword == "" && this.newPassword == "" &&this.newPasswordConfirm == "" && file != null)
    {
      let formData1 = new FormData();
      formData1.append("image", file);
      await this.userService.edit(formData1);
    }
    else if(this.oldPassword != "" && this.newPassword != "" &&this.newPasswordConfirm != "" && file == null)
    {
      let formData2 = new FormData();
      formData2.append("old",this.oldPassword);
      formData2.append("new",this.newPassword);
      await this.userService.edit(formData2);
    }
    else if(this.oldPassword != "" && this.newPassword != "" &&this.newPasswordConfirm != "" && file != null){
      let formData3 = new FormData();
      formData3.append("image", file);
      formData3.append("old",this.oldPassword);
      formData3.append("new",this.newPassword);
      await this.userService.edit(formData3);
    }
    this.oldPassword = "";
    this.newPassword = "";
    this.newPasswordConfirm = "";
  }
}
