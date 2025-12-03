import { Component, ElementRef, ViewChild } from '@angular/core';
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
    if(this.myPicture == null) return;
    
    let file = this.myPicture.nativeElement.files[0];
    if(file == null) return;

    let formData = new FormData();

    formData.append("image", file);
    formData.append("old",this.oldPassword);
    formData.append("new",this.newPassword);

    await this.userService.edit(formData);
  }
}
