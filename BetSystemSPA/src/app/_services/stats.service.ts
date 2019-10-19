import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { teamStats } from '../_models/teamStats';
import { Observable } from 'rxjs';
import { teamProfit } from '../_models/teamProfit';
import { dateStats } from '../_models/dateStats';
import { statistics } from '../_models/statistics';
import { CountryStats } from '../_models/countryStats';


@Injectable({
  providedIn: 'root'
})
export class StatsService {
  baseUrl = environment.apiUrl + 'statistics/';

  constructor(private http: HttpClient) { }

  getTeamsProfit(): Observable<teamProfit[]> {
    return this.http.get<teamProfit[]>(this.baseUrl + 'profits');
  }

  getTeamsStats(): Observable<teamStats[]> {
    return this.http.get<teamStats[]>(this.baseUrl);
  }

  getTeamStats(id: number): Observable<teamStats> {
    return this.http.get<teamStats>(this.baseUrl + id);
  }

  getDateStats(): Observable<dateStats[]> {
    return this.http.get<dateStats[]>(this.baseUrl + 'dates');
  }

  getStatistics(): Observable<statistics> {
    return this.http.get<statistics>(this.baseUrl + 'stats');
  }

  getCountryStats(): Observable<CountryStats[]> {
    return this.http.get<CountryStats[]>(this.baseUrl + 'countries');
  }
  
}
