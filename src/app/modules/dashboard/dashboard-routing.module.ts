import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { IndexComponent } from '../../components/dashboard/index/index.component';
import { DealerUsageComponent } from '../../components/dashboard/dealer-usage/dealer-usage.component';
import { ThreadComponent } from '../../components/dashboard/thread/thread.component';
import { EscalationByModelsComponent } from '../../components/dashboard/escalation/escalation-by-models/escalation-by-models.component';
import { EscalationByRegionComponent } from '../../components/dashboard/escalation/escalation-by-region/escalation-by-region.component';
import { MonthlyEscalationsComponent } from '../../components/dashboard/escalation/monthly-escalations/monthly-escalations.component';
import { ActiveEscalationsComponent } from '../../components/dashboard/escalation/active-escalations/active-escalations.component';
import { ServiceProbingComponent } from '../../components/dashboard/service-probing/service-probing.component';
import { ZoneMetricsComponent } from '../../components/dashboard/events/zone-metrics/zone-metrics.component';
import { AreaMetricsComponent } from '../../components/dashboard/events/area-metrics/area-metrics.component';
import { UserActivityComponent } from '../../components/dashboard/events/user-activity/user-activity.component';
import { GtsUsageComponent } from '../../components/dashboard/gts/gts-usage/gts-usage.component';
import { GtsDealerComponent } from '../../components/dashboard/gts/gts-dealer/gts-dealer.component';
import { NewDashboardComponent } from '../base/components/new-dashboard/new-dashboard.component';
import { LeaderboardComponent } from 'src/app/components/dashboard/leaderboard/leaderboard.component';
import { UserActivitiesComponent } from 'src/app/components/dashboard/user-activities/user-activities.component';
import { TechsupportMetricsComponent } from 'src/app/components/dashboard/techsupport/techsupport-metrics/techsupport-metrics.component';
import { ManufactureChartComponent } from 'src/app/components/dashboard/manufacture-chart/manufacture-chart.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      { path: '', component: IndexComponent },
      { path: 'escalation', component: NewDashboardComponent },
      { path: 'dealer-usage', component: DealerUsageComponent },
      { path: 'threads', component: ThreadComponent },
      { path: 'escalations', component: EscalationByModelsComponent },
      { path: 'escalation/models', component: EscalationByModelsComponent },
      { path: 'escalation/region', component: EscalationByRegionComponent },
      { path: 'monthly/escalations', component: MonthlyEscalationsComponent },
      { path: 'active/escalations', component: ActiveEscalationsComponent },
      { path: 'service-probing', component: ServiceProbingComponent },
      { path: 'events', component: ZoneMetricsComponent },
      { path: 'events/zone-metrics', component: ZoneMetricsComponent },
      { path: 'events/area-metrics', component: AreaMetricsComponent },
      { path: 'events/user-activity', component: UserActivityComponent },
      { path: 'gts', component: GtsUsageComponent },
      { path: 'gts/gts-usage', component: GtsUsageComponent },
      { path: 'gts/dealer-usage', component: GtsDealerComponent },
      { path: 'leaderboard', component: LeaderboardComponent },
      { path: 'user-activity', component: UserActivitiesComponent },
      { path: 'techsupport-metrics', component: TechsupportMetricsComponent },
      { path: 'manufacture-chart', component: ManufactureChartComponent },      
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
