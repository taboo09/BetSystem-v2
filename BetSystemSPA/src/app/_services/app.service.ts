import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  baseUrl = environment.apiUrl + 'app/';

  constructor(private http: HttpClient) { }

  getAppVersion(){
    return this.http.get<Object>(this.baseUrl);
  }

  getCredentials(){
    return this.http.get<Object>(this.baseUrl + 'credentials');
  }
}
