import { CurrencyService } from './../_services/currency.service';
import { teamStats } from './../_models/teamStats';
import { StatsService } from './../_services/stats.service';
import { team } from './../_models/team';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TeamService } from '../_services/team.service';
import { SnackBarService } from '../_services/snack-bar.service';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';
import { currency } from '../_models/currency';

@Component({
  selector: 'team-modal',
  templateUrl: './team-modal.component.html',
  styleUrls: ['./team-modal.component.css']
})
export class TeamModalComponent implements OnInit {
  message: string = 'init';
  colorSlide = 'accent';
  checkedSlide = 'false';
  disabledSlide = 'false';
  rgbColors = ['255, 99, 132', '54, 162, 235', '255, 206, 86', '75, 192, 192', '255, 65, 54', '153, 102, 255', '255, 159, 64', '46, 204, 64'];
  teamForm: FormGroup;
  teamStats: teamStats;
  teamChart = [];
  currency: currency;

  constructor(
    public dialogRef: MatDialogRef<TeamModalComponent>,
    @Inject(MAT_DIALOG_DATA) public team: team,
    private fb: FormBuilder,
    private teamService: TeamService,
    private snackBarService: SnackBarService,
    private statsService: StatsService,
    private currencyService: CurrencyService,
    private router: Router) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.createForm();
    this.getTeamDetails();
    this.getSelectedCurrency();
  }

  createForm(){
    this.teamForm = this.fb.group({
      enabled: [this.team.enabled],
      comment: [this.team.comment]
    });
  }

  getTeamDetails(){
    this.statsService.getTeamStats(this.team.id)
      .subscribe(team => {
        this.teamStats = team;
        if(team.matchesPlayed > 0) {
        this.createChartTeam();
        }
      }, error => {
        this.snackBarService.snackBarMessage(error, "Close", "error");
      });
  }

  // return array of team stars number
  counterStarts(n:number){
    return new Array(n);
  }

  saveTeam(){
    Object.assign(this.team, this.teamForm.value);
    this.teamService.updateTeam(this.team)
    .subscribe( next => {
      this.snackBarService.snackBarMessage(next['message'], "Ok", "confirm");
      this.router.navigate(['/home']);
    }, error => {
      this.snackBarService.snackBarMessage(error, "Close", "error");
    });
  }

  getSelectedCurrency(){
    this.currencyService.selectedCurrency
      .subscribe(c => this.currency = c);
  }

  createChartTeam(){
    this.teamChart = new Chart('teamChart', {
      type: 'pie',
      data: {
        labels: ['Money Bet ' + (this.currency.symbol != ' ' ? '(' + this.currency.symbol + ')' : ' '),
           'Money Earn ' + (this.currency.symbol != ' ' ? '(' + this.currency.symbol + ')' : ' ')],
        datasets: [{
          data: [this.teamStats.moneyBet, this.teamStats.moneyEarn],
          backgroundColor: ['rgba(' + this.rgbColors[4] + ', 0.4)', 'rgba(' + this.rgbColors[1] + ', 0.4)'],
          borderColor: 'transparent',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio : true,
        aspectRatio: 1,
        legend: {
            display: true,
            position: "bottom",
            labels: {
                fontColor: "#fff",
                // fontSize: 16
            }
        },
        tooltips: {
          position: "average",
          yAlign: "top"
        }
      }
    });
  }

}
