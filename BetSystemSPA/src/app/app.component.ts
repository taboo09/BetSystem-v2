import { AppService } from './_services/app.service';
import { CurrencyService } from './_services/currency.service';
import { Component, OnInit } from '@angular/core';
import { currency } from './_models/currency';
import { MatBottomSheet } from '@angular/material';
import { InfoRulesComponent } from './info-rules/info-rules.component';

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

  constructor(private currencyService: CurrencyService,
      private appService: AppService,
      private _bottomSheet: MatBottomSheet) {}

  ngOnInit(){
    this.getCurrency();
    this.getAppLastVersion();
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
        this.version = v["value"];
      });
  }

  openInfoRules(){
    this._bottomSheet.open(InfoRulesComponent)
  }
}
