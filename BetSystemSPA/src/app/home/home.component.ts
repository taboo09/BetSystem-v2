import { currency } from './../_models/currency';
import { CurrencyService } from './../_services/currency.service';
import { statistics } from './../_models/statistics';
import { teamStats } from './../_models/teamStats';
import { Component, OnInit } from '@angular/core';
import { StatsService } from '../_services/stats.service';
import { SnackBarService } from '../_services/snack-bar.service';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { TeamModalComponent } from '../team-modal/team-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  teamStats: teamStats[];
  statistics: statistics;
  currency: currency;
  dataSource;
  profitSort:string = 'desc';
  displayedColumns: string[] = ['no', 'team', 'stars', 'matches', 'total_bet', 'total_earn', 'next_stake', 'profit'];


  constructor(private statsService: StatsService,
    private snackBarService: SnackBarService,
    private currencyService: CurrencyService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getTeamStats();
    this.getStatistics();
    this.getSelectedCurrency();
  }

  getTeamStats(){
    this.statsService.getTeamsStats()
      .subscribe(teamsStats => {
        this.teamStats = teamsStats;
        this.dataSource = new MatTableDataSource(this.teamStats);
        // this.teamsProfit = teamsStats.map(x => ({ name: x.name, profit: x.profit}));
        // this.statsService.getTeamsProfitFromHome(this.teamsProfit);
      }, error => {
        this.snackBarService.snackBarMessage(error, 'close', 'error');
      });
  }

  getStatistics(){
    setTimeout( () => {
    this.statsService.getStatistics()
      .subscribe( data => {
        this.statistics = data;
      }, error => {
        this.snackBarService.snackBarMessage(error, 'close', 'error');
      });
    }, 50);
  }

  // return array of team stars number
  counterStarts(n:number){
    return new Array(n);
  }

  getSelectedCurrency(){
    this.currencyService.selectedCurrency
      .subscribe(c => this.currency = c);
  }

  // display team modal
  openDialog(team: teamStats): void {
    const dialogRef = this.dialog.open(TeamModalComponent, {
      width: '85%',
      maxWidth: 950,
      height: '80%',
      disableClose: false,
      data: team
    });
  }


  sortTeamAsc(){
    this.dataSource = this.teamStats.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : 
      (b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 0));
    this.profitSort = 'desc';
  }

  sort(type: string){
    if (type == 'desc'){
      this.dataSource = new MatTableDataSource(this.teamStats.sort((a, b) => b.profit - a.profit));
      this.profitSort = 'asc';
    } else {
      this.dataSource = new MatTableDataSource(this.teamStats.sort((a, b) => a.profit - b.profit));
      this.profitSort = 'desc';
    }
  }

  sortPlayedDesc(){
    this.dataSource = new MatTableDataSource(this.teamStats.sort((a, b) => b.matchesPlayed - a.matchesPlayed));
  }

}
