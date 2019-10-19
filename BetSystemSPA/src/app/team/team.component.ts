import { team } from './../_models/team';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SnackBarService } from './../_services/snack-bar.service';
import { Component, OnInit } from '@angular/core';
import { TeamService } from '../_services/team.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { TeamModalComponent } from '../team-modal/team-modal.component';
import { SeasonService } from '../_services/season.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  showSpinner: boolean = false;
  teams: team[];
  team = {} as team;
  season: any = {};
  teamForm: FormGroup;
  countries = ['Belgium', 'France', 'Germany', 'Greece', 'Italy', 'Netherlands', 'Norway', 'Other', 
    'Portugal', 'Romania', 'Russia', 'Spain', 'Sweden', 'Switzerland', 'Turkey', 'UK'];

  constructor(private teamService: TeamService,
      private snackBarService: SnackBarService,
      private seasonService: SeasonService,
      private fb: FormBuilder,
      private router: Router,
      private dialog: MatDialog) { }

  ngOnInit() {
    this.getTeams();
    this.createTeamForm();
    this.checkSeason();
  }

  createTeamForm(){
    this.teamForm = this.fb.group({
      name: ['', 
        [Validators.required, Validators.maxLength(36), Validators.minLength(2)]
    ],
      country: ['', Validators.required],
      comment: []
    },
      { validator: this.teamNameValidation }
    );
  }

  teamNameValidation(g: FormControl){
    let name = g.get('name').value;
    // teams is not a solution because of the Observable
    let btns = document.getElementsByClassName('colorBtn') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < btns.length; i++) {
      if (btns[i].innerHTML.toLowerCase() === name.toLowerCase()) 
      return {'error': true}; 
    }
    return null;
  }

  errorMessage(){
    return '"' + this.teamForm.value.name.toUpperCase() + '" already added in this season.';
  }

  getTeams() {
    setTimeout( () => {
    this.teamService.getTeams()
      .subscribe(teams => {
        this.teams = teams;
        this.displayTeams();
      }, error => {
        this.snackBarService.snackBarMessage(error, 'close', 'error');
      });
    }, 600);
  }

  addTeam(){
    // this.teamForm.reset({ comment: commentValue });
    Object.assign(this.team, this.teamForm.value);
    this.teamService.addTeam(this.team)
      .subscribe( next => {
        this.snackBarService.snackBarMessage(this.team.name + ' has been added to the current season', 'Ok', 'confirm');
        this.router.navigate(['/home']);
      }, error => {
        this.snackBarService.snackBarMessage(error, 'close', 'error');
      });
  }

  displayTeams(){
    setTimeout( () => { // display the btns colors
      let colors = ['success', 'warning', 'primary', 'danger', 'secondary', 'info', 'light', 'dark'];
      let btns = document.getElementsByClassName('colorBtn') as HTMLCollectionOf<HTMLElement>;
      let indexColor = 0;

      for (let i = 0; i < btns.length; i++) {
        if (indexColor >= colors.length) indexColor = 0;
        btns[i].classList.add('btn-' + colors[indexColor].toString());
        indexColor++;
      }
    });
  }

  checkSeason(){
    setTimeout( () => { 
    // get selected season from season Service
    this.seasonService.getSelectedSeason()
      .subscribe(s => {
        this.season = s;
        if (this.season && (this.season.active === false)) this.teamForm.disable();
      });
    });
  }

  // display team modal
  openDialog(team: team): void {
    const dialogRef = this.dialog.open(TeamModalComponent, {
      width: '85%',
      maxWidth: 950,
      height: '80%',
      disableClose: false,
      data: team
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }
}
