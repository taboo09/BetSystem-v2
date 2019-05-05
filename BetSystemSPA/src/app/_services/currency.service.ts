import { currency } from './../_models/currency';
import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  baseUrl = environment.apiUrl + 'currency/';
  private currencySource = new BehaviorSubject<currency>({} as currency);
  selectedCurrency = this.currencySource.asObservable();

  constructor(private http: HttpClient) { }

  getCurrencies() {
    return this.http.get<currency[]>(this.baseUrl);
  }

  selectCurrency(id: number) {
    return this.http.put(this.baseUrl + id, id);
  }

  getSelectedCurrency() {
    return this.http.get<currency>(this.baseUrl + "selected");
  }

  // shared service
  // sharing data between components
  getSelectedCurrencyFromHome(c: currency){
    this.currencySource.next(c);
  }

}