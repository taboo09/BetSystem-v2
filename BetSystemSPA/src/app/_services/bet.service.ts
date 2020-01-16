import { BetsCount } from './../_models/betsCount';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { bet } from '../_models/bet';
import { betUpdate } from '../_models/betUpdate';

@Injectable({
  providedIn: 'root'
})
export class BetService {
  baseUrl = environment.apiUrl + 'bet/';
  private obj = new BehaviorSubject<Object>({} as Object);
  noBets = this.obj.asObservable();

  // shared service
  getNoBets(no: Object){
    this.obj.next(no);
  }

  constructor(private http: HttpClient) { }

  getBets(start: number): Observable<bet[]> {
    return this.http.get<bet[]>(this.baseUrl + '?start=' + start);
  }

  getCount(){
    return this.http.get<BetsCount>(this.baseUrl + 'count');
  }

  getBetsByTeamId(teamId: number){
    return this.http.get<bet[]>(this.baseUrl + teamId);
  }

  getCustomBets(selection: string){
    return this.http.get<bet[]>(this.baseUrl + selection);
  }

  getBetsByCountry(country: string){
    return this.http.get<bet[]>(this.baseUrl + 'country/' + country);
  }

  addBet(bet: object){
    return this.http.post<object>(this.baseUrl, bet);
  }

  deleteBet(id: number){
    return this.http.delete<object>(this.baseUrl + id);
  }

  editBet(bet: betUpdate){
    return this.http.put<object>(this.baseUrl, bet);
  }
}