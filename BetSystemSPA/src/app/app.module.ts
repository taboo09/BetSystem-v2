import { StatsService } from './_services/stats.service';
import { SnackBarService } from './_services/snack-bar.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeasonService } from './_services/season.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BsDropdownModule, BsModalService, ModalModule, ButtonsModule } from 'ngx-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule, MatButtonModule, MatIconModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatTooltipModule, MatDialogModule, MatProgressSpinnerModule, MatSnackBarModule, MatCardModule, MatSlideToggleModule, MatExpansionModule } from '@angular/material';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { JumbotronComponent } from './jumbotron/jumbotron.component';
import { BetsComponent } from './bets/bets.component';
import { BetNewComponent } from './bet-new/bet-new.component';
import { TeamService } from './_services/team.service';
import { BetService } from './_services/bet.service';
import { appRoutes } from './routes';
import { RouterModule } from '@angular/router';
import { TeamComponent } from './team/team.component';
import { SpinnerComponent, Spinner2Component, Spinner3Component } from './spinner/spinner.component';
import { TeamModalComponent } from './team-modal/team-modal.component';
import { AdminComponent } from './admin/admin.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { HomeComponent } from './home/home.component';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { DatePipe } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    JumbotronComponent,
    BetsComponent,
    BetNewComponent,
    TeamComponent,
    SpinnerComponent,
    Spinner2Component,
    Spinner3Component,
    TeamModalComponent,
    AdminComponent,
    StatisticsComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    HttpClientModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCardModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    NgbModule,
    ModalModule,
    MatExpansionModule,
    InfiniteScrollModule,
    ButtonsModule.forRoot(),
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled'
    })
  ],
  providers: [
    SeasonService,
    TeamService,
    BetService,
    StatsService,
    BsModalService,
    SnackBarService,
    DatePipe,
    ErrorInterceptorProvider
  ],
  entryComponents: [
    TeamModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }