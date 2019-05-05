import { SeasonNew } from './../_models/seasonNew';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Season } from '../_models/season';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {
  baseUrl = environment.apiUrl + 'season/';
  private seasonSource = new BehaviorSubject<Season>({} as Season);
  currentSeason = this.seasonSource.asObservable();

  constructor(private http: HttpClient) { }

  // shared service
  // sharing data between admin component and jumbotron component
  changeSelectedSeason(s: Season){
    this.seasonSource.next(s);
  }

  getSelectedSeason(): Observable<Season> {
    return this.http.get<Season>(this.baseUrl + 'selected');
  }

  getSeasons(): Observable<Season[]> {
    return this.http.get<Season[]>(this.baseUrl);
  }

  addSeason(season: SeasonNew): Observable<Season>{
    return this.http.post<Season>(this.baseUrl, season);
  }

  selectSeason(id: number){
    return this.http.put(this.baseUrl + id + '/select', id);
  }

  closeSeason(id: number){
    return this.http.put(this.baseUrl + id, id);
  }
}
