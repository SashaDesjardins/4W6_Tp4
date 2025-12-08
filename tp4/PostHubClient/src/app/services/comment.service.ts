import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Comment } from '../models/comment';

const domain = "https://localhost:7216/";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(public http : HttpClient) { }

  // Modifier un commentaire (que ce soit le commentaire principal d'un post ou un sous-commentaire)
  async editComment(FormData : FormData, commentId : number) : Promise<Comment>{

    let x = await lastValueFrom(this.http.put<any>(domain + "api/Comments/PutComment/" + commentId, FormData));
    console.log(x);
    return x;

  }

  // Créer un sous-commentaire (donc tous les commentaires qui ne sont pas le commentaire principal d'un post)
  async postComment(formdata : any, parentCommentId : number) : Promise<Comment>{

    let x = await lastValueFrom(this.http.post<any>(domain + "api/Comments/PostComment/" + parentCommentId, formdata));
    console.log(x);
    return x;

  }

  // Supprimer un commentaire (que ce soit le commentaire principal d'un post ou un sous-commentaire)
  async deleteComment(commentId : number) : Promise<void>{

    let x = await lastValueFrom(this.http.delete<any>(domain + "api/Comments/DeleteComment/" + commentId));
    console.log(x);

  }

  // Upvote un commentaire (que ce soit le commentaire principal d'un post ou un sous-commentaire)
  async upvote(commentId : number){
    let x = await lastValueFrom(this.http.put<any>(domain + "api/Comments/UpvoteComment/" + commentId, null));
    console.log(x);
  }

  // Downvote un commentaire (que ce soit le commentaire principal d'un post ou un sous-commentaire)
  async downvote(commentId : number){
    let x = await lastValueFrom(this.http.put<any>(domain + "api/Comments/DownvoteComment/" + commentId, null));
    console.log(x);
  }

  async deletePicture(id : number){
    let x = await lastValueFrom(this.http.delete<any>(domain + "api/Comments/DeletePicture/" + id));
    console.log(x);
  }

  async signaler(id : number){
    let x = await lastValueFrom(this.http.put<any>(domain + "api/Comments/ReportComment/" + id, null));
    console.log(x);
  }

  async commentSignaler() : Promise<Comment[]>
  {
    let x = await lastValueFrom(this.http.get<any>(domain + "api/Comments/GetReportedCommens"));
    console.log(x);
    return x
  }

}
