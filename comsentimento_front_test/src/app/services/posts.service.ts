import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(
    private http: HttpClient,
    ) { };

  listPost() {
    return this.http.get(`${environment.api}/post/lst`);
  };
}
