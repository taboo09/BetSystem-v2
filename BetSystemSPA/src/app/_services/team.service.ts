import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { team } from '../_models/team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  baseUrl = environment.apiUrl + 'team/';

  constructor(private http: HttpClient) { }

  getTeams(): Observable<team[]>{
    return this.http.get<team[]>(this.baseUrl);
  }

  getTeamsPromise(){
    return this.http.get(this.baseUrl).toPromise();
  }

  addTeam(team: team){
    return this.http.post(this.baseUrl, team);
  }

  updateTeam(team: team){
    return this.http.put(this.baseUrl, team);
  }
}
