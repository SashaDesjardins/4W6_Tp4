import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { dom } from '@fortawesome/fontawesome-svg-core';
import { lastValueFrom } from 'rxjs';

const domain = "https://localhost:7216/";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http : HttpClient) { }
  rolesSignal : WritableSignal<string[]> = signal([]);
  // S'inscrire
  async register(username : string, email : string, password : string, passwordConfirm : string) : Promise<void>{

    let registerDTO = {
      username : username,
      email : email,
      password : password,
      passwordConfirm : passwordConfirm
    };

    let x = await lastValueFrom(this.http.post<any>(domain + "api/Users/Register", registerDTO));
    console.log(x);
  }

  // Se connecter
  async login(username : string, password : string) : Promise<void>{

    let loginDTO = {
      username : username,
      password : password
    };

    let x = await lastValueFrom(this.http.post<any>(domain + "api/Users/Login", loginDTO));
    console.log(x);

    // N'hésitez pas à ajouter d'autres infos dans le stockage local... 
    // Cela pourrait vous aider pour la partie admin / modérateur
    localStorage.setItem("token", x.token);
    localStorage.setItem("username", x.username);
    localStorage.setItem("roles",x.roles)
    this.rolesSignal.set(x.roles)
    
  }

  async edit(formData : any)
  {
    let x = await lastValueFrom(this.http.put<any>(domain + "api/Users/EditUser", formData));
    console.log(x);
  }

  async makeMod(username:string){
    let x =await lastValueFrom(this.http.put<any>(domain+"api/Users/ChangeRole/" + username, null))
    console.log(x)
  }

}
