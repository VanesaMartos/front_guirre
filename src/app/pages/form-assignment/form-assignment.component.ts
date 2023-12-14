import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from 'src/app/core/models/article.interface';
import { User } from 'src/app/core/models/user.interface';
import { ArticlesService } from 'src/app/core/services/articles.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-form-assignment',
  templateUrl: './form-assignment.component.html',
  styleUrls: ['./form-assignment.component.css']
})
export class FormAssignmentComponent {

  newAssignment: FormGroup;
  articleId: string = '';
  userInfo!: User;
  allEditors: User[] = [];
  allWriters: User[] = [];

  articlesService = inject(ArticlesService);
  usersService = inject(UsersService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);


  constructor() {
    this.newAssignment = new FormGroup({
      user_id: new FormControl(''),
      articles_id: new FormControl(),
      comments: new FormControl(),
      actual_status: new FormControl('revision'),
    }, [])
  }

  async ngOnInit() {
    this.userInfo = await this.usersService.getById();
    this.allEditors = await this.usersService.getByRole('editor');
    this.allWriters = await this.usersService.getByRole('redactor');

    this.activatedRoute.params.subscribe(async params => {
      this.articleId = params['articleId'];
      const response = await this.articlesService.getById(this.articleId);
      const { id } = response;
      this.newAssignment.patchValue({ articles_id: id, user_id: this.userInfo.id });
    })
  }

  async onSubmit() {
    try {
      const response = await this.articlesService.assignArticle(this.articleId, this.newAssignment.value);
      console.log(response);
    } catch (e: any) {
      console.log(e);
    }
  }


}