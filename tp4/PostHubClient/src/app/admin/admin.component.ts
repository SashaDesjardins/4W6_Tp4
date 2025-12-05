import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { HubService } from '../services/hub.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
    modName:string=""
  constructor(public userService : UserService, public hubService : HubService, public router : Router) { }

  makeMod(){
    let x= this.userService.makeMod(this.modName)
    console.log(x)
  }

}
