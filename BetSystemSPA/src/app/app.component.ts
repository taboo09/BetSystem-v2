import { AppService } from './_services/app.service';
import { SnackBarService } from './_services/snack-bar.service';
import { CurrencyService } from './_services/currency.service';
import { Component, OnInit } from '@angular/core';
import { currency } from './_models/currency';
import { getCurrencySymbol } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'BetSystem';
  currency: currency;
  year = new Date().getFullYear();
  version:any;
  credentials:any;

  constructor(private currencyService: CurrencyService,
      private appService: AppService,
      private snackBarService: SnackBarService) {}

  ngOnInit(){
    this.getCurrency();
    this.getAppLastVersion();
    this.getCredentials();
  }

  getCurrency(){
    this.currencyService.getSelectedCurrency()
      .subscribe(c => {
        this.currency = c;
        // send the selected season to components throughout a shared service
        this.currencyService.getSelectedCurrencyFromHome(this.currency);
      });
  }

  getAppLastVersion(){
    this.appService.getAppVersion()
      .subscribe(v => {
      var keys = Object.keys(v);
      this.version = v[keys[1]];
      });
  }

  getCredentials(){ //works only in windows
    this.appService.getCredentials()
      .subscribe(c => {
        this.credentials = c;
      })
  }
}
