import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message =  '';
  logged = 0;
  posts = [];

  constructor(
    private authService: AuthService,
    private postsService: PostService
  ) { }

  ngOnInit(): void {
    const auth = this.authService.user().subscribe({
      next: (res: any) => {
        this.logged = 1;
        this.message = `Hi ${res.first_name} ${res.last_name}!`;
        const x = AuthService.authEmitter.emit(true);

        // const x = this.postsService.listPost();

        console.log(Headers);
      },
      error: () => {
        this.logged = 0;
        this.message = `You are not authenticated!`;
        AuthService.authEmitter.emit(false);
      },
    });
  };
};
