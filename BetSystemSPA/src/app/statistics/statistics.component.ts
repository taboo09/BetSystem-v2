import { currency } from './../_models/currency';
import { CurrencyService } from './../_services/currency.service';
import { DatePipe } from '@angular/common';
import { dateStats } from './../_models/dateStats';
import { teamProfit } from './../_models/teamProfit';
import { StatsService } from './../_services/stats.service';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { SnackBarService } from '../_services/snack-bar.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  datesChart = [];
  profitChart = [];
  teamsChart = [];
  teamsProfit: teamProfit[];
  dates: dateStats[];
  totalProfit = [];
  showDatesChart:boolean = true;
  currency: currency;
  backgroundColors = [];
  borderColors = [];
  rgbColors = ['255, 99, 132', '54, 162, 235', '255, 206, 86', '75, 192, 192', '255, 65, 54', '153, 102, 255', '255, 159, 64', '46, 204, 64'];

  constructor(private statsService: StatsService,
      private currencyService: CurrencyService,
      private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.getSelectedCurrency();
    this.getData();
   
  }

  getData(){
    setTimeout(() => {
    this.statsService.getTeamsProfit()
      .subscribe(teamsProfit => {
        this.teamsProfit = teamsProfit;
        if(this.teamsProfit.length > 0){
          this.setColors();
          this.createChartTeams();
        }
      }, error => {
        this.snackBarService.snackBarMessage(error, 'close', 'error');
      });

      
      let datePipe = new DatePipe('en-US');
      this.statsService.getDateStats()
        .subscribe(dates => {
          this.dates = dates;
          this.showDatesChart = false; // hide dates canvas
          this.dates.forEach(d => d.date = datePipe.transform(d.date, 'dd/MM/yy'));
          if(this.dates.length > 0) {
            this.showDatesChart = true; // display dates canvas
            this.setTotalProfit(this.dates);
            this.createChartProfit();
            this.createChartDateStats(this.dates);
          }
        })
    }, 600);
  }

  getSelectedCurrency(){
    this.currencyService.selectedCurrency
      .subscribe(c => this.currency = c);
  }

  createChartTeams(){
    this.teamsChart = new Chart('teamsChart', {
      type: 'bar',
      data: {
        labels: this.teamsProfit.map(x => x.name),
        datasets: [{
          label: 'Team / Profit ' + (this.currency.symbol != ' ' ? '(' + this.currency.symbol + ')' : ' '),
          // label: 'Team / Profit' + this.currency.symbol,
          data: this.teamsProfit.map(x => x.profit),
          backgroundColor: this.backgroundColors,
          borderColor: this.borderColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }],
            xAxes: [{
                ticks: {
                    stepSize: 1,
                    autoSkip: false
                }
            }]
        }
      }
    });
  }

  createChartProfit(){
    this.profitChart = new Chart('profitChart', {
      type: 'bar',
      data: {
        labels: this.dates.map(x => x.date),
        datasets: [{
          label: 'Total Profit ' + (this.currency.symbol != ' ' ? '(' + this.currency.symbol + ')' : ' '),
          data: this.totalProfit,
          backgroundColor: 'rgba(' + this.rgbColors[0] + ', 0.2)',
          borderColor: 'rgba(' + this.rgbColors[1] + ', 1)',
          pointBorderColor: 'rgba(' + this.rgbColors[2] + ', 1)',
          pointBackgroundColor: 'rgba(' + this.rgbColors[3] + ', 0.2)',
          borderWidth: 1,
          pointHoverBorderWidth: 3,
          type: 'line'
        },
        {
          label: 'Date Profit ' + (this.currency.symbol != ' ' ? '(' + this.currency.symbol + ')' : ' '),
          data: this.dates.map(x => x.profit),
          backgroundColor: 'rgba(' + this.rgbColors[2] + ', 0.2)',
          borderColor: 'rgba(' + this.rgbColors[2] + ', 1)',
          // pointBorderColor: 'rgba(' + this.rgbColors[1] + ', 1)',
          // pointBackgroundColor: 'rgba(' + this.rgbColors[1] + ', 0.8)',
          borderWidth: 1,
          // pointHoverBorderWidth: 3,
          type: 'bar'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio : true,
        aspectRatio: 1,
        scales: {
            yAxes: [{
                stacked: true
            }]
        }
      }
    });
  }

  createChartDateStats(dates: dateStats[]){
    this.datesChart = new Chart('datesChart', {
      type: 'bar',
      data: {
        labels: this.dates.map(x => x.date),
        datasets: [{
          label: 'Money Bet ' + (this.currency.symbol != ' ' ? '(' + this.currency.symbol + ')' : ' '),
          data: this.dates.map(x => x.moneyBet),
          backgroundColor: 'rgba(' + this.rgbColors[4] + ', 0.35)',
          borderColor: 'rgba(' + this.rgbColors[3] + ', 1)',
          borderWidth: 1
        },
        {
          label: 'Money Earn ' + (this.currency.symbol != ' ' ? '(' + this.currency.symbol + ')' : ' '),
          data: this.dates.map(x => x.moneyEarn),
          backgroundColor: 'rgba(' + this.rgbColors[1] + ', 0.35)',
          borderColor: 'rgba(' + this.rgbColors[3] + ', 1)',
          borderWidth: 1,
        }]
      },
      options: {
        tooltips: {
          mode: 'label',
          titleSpacing: 5,
          bodySpacing: 5,
          callbacks: {
            label: function(tooltipItem, data) {
              if(tooltipItem.datasetIndex == 1) {
                var profit = dates.map(x => x.profit)[tooltipItem.index];
                return [data.datasets[tooltipItem.datasetIndex].label + ":  " + tooltipItem.yLabel , 'Profit '  + profit]
              }
              return data.datasets[tooltipItem.datasetIndex].label + ":  " + tooltipItem.yLabel
            },
            labelColor: function(tooltipItem, chart) {
              return {
                  backgroundColor: tooltipItem.datasetIndex == 0 ? 'rgba(255, 65, 54, .85)' : 'rgba(54, 162, 235, .95)'
              } 
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                },
                stacked: false
            }],
            xAxes: [{
                ticks: {
                    stepSize: 1,
                    autoSkip: true,
                    beginAtZero:true
                },
                stacked: true
            }]
        }
      }
    })
  }

  setTotalProfit(dates: dateStats[]){
    let profit = 0;
    dates.forEach(element => {
      profit = parseFloat((profit + element.profit).toFixed(2));
      this.totalProfit.push(profit);
    });
  }

  setColors(){
    let index = 0;

    for (let i = 0; i < this.teamsProfit.length; i++) {
      this.backgroundColors.push('rgba(' + this.rgbColors[index] + ', 0.2)');
      this.borderColors.push('rgba(' + this.rgbColors[index] + ', 1)');
      index++;

      // reset index
      if(index == this.rgbColors.length) index = 0;
    }
  }

}