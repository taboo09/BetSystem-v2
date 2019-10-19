import { SeasonService } from './../_services/season.service';
import { team } from './../_models/team';
import { BetService } from './../_services/bet.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TeamService } from '../_services/team.service';
import { Router } from '@angular/router';
import { SnackBarService } from '../_services/snack-bar.service';
import { bet } from '../_models/bet';
import { MatSelect } from '@angular/material';

@Component({
  selector: 'bet-new',
  templateUrl: './bet-new.component.html',
  styleUrls: ['./bet-new.component.css']
})
export class BetNewComponent implements OnInit, AfterViewInit {
  bet: bet;
  matchForm: FormGroup;
  teams: team[];
  season: any = {};
  @ViewChild('teamName') teamName: MatSelect;
  
  constructor(private betService: BetService,
      private teamService: TeamService,
      private snackBarService: SnackBarService,
      private seasonService: SeasonService,
      private fb: FormBuilder,
      private router: Router) { }

  ngOnInit() {
    this.getTeams();
    this.createMatchForm();
    this.checkSeason();
    setTimeout(() => {
      this.teamName.focus();
    }, 50);
    
  }

  ngAfterViewInit(){
    // this.teamName.focus();
  }

  createMatchForm(){
    this.matchForm = this.fb.group({
      teamId: ['', Validators.required],
      home: ['', Validators.required],
      away: ['', Validators.required],
      date: [new Date(), Validators.required],
      odd: ['', Validators.required],
      stake: ['', Validators.required]
    });
  }

  getTeams(){
    this.teamService.getTeams()
      .subscribe(teams => {
        this.teams = teams.filter(x => x.enabled);
      });
  }

  AddBet(){
    if (this.matchForm.valid){
      this.bet = Object.assign({}, this.matchForm.value);
      // Getting date string format to ignore UTC
      this.bet.date_text = this.bet.date.toLocaleDateString();
      this.betService.addBet(this.bet)
        .subscribe( next => {
          this.snackBarService.snackBarMessage(next['message'], 'Ok', 'confirm');
          this.router.navigate(['/home']);
        }, error => {
          this.snackBarService.snackBarMessage(error, 'close', 'error');
        });
    }
  }

  Cancel() {
    this.matchForm.reset();
  }

  checkSeason(){
    this.seasonService.currentSeason
      .subscribe(s => {
        this.season = s;
        if (this.season && (this.season.active === false)) this.matchForm.disable();
      });
  }

}
