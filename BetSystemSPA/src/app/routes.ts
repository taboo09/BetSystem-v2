import { BetNewComponent } from './bet-new/bet-new.component';
import { BetsComponent } from './bets/bets.component';
import { Routes } from '@angular/router';
import { TeamComponent } from './team/team.component';
import { AdminComponent } from './admin/admin.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { HomeComponent } from './home/home.component';

export const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'admin', component: AdminComponent, },
    { path: 'bets', component: BetsComponent },
    { path: 'bets/:teamId', component: BetsComponent },
    { path: 'stats', component: StatisticsComponent },
    { path: 'team', component: TeamComponent },
    { path: 'new-bet', component: BetNewComponent },
    { path: '**', component: HomeComponent }
]