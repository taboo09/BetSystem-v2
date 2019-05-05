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

  getBets(): Observable<bet[]> {
    return this.http.get<bet[]>(this.baseUrl);
  }

  addBet(bet: bet){
    return this.http.post(this.baseUrl, bet);
  }

  deleteBet(id: number){
    return this.http.delete(this.baseUrl + id);
  }

  editBet(bet: betUpdate){
    return this.http.put(this.baseUrl, bet);
  }
}