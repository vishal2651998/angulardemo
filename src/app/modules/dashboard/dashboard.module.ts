import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardService } from '../.../../../services/dashboard/dashboard.service';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { DashFilterComponent } from '../../components/dashboard/dash-filter/dash-filter.component';
import { UsertypesComponent } from '../../components/common/usertypes/usertypes.component';
import { AreasComponent } from '../../components/common/areas/areas.component';
import { TerritoriesComponent } from '../../components/common/territories/territories.component';
import { TownsComponent } from '../../components/common/towns/towns.component';
import { DealersComponent } from '../../components/common/dealers/dealers.component';
import { ThreadUsersComponent } from '../../components/common/thread-users/thread-users.component';
import { IndexComponent } from '../../components/dashboard/index/index.component';
import { DashboardHeaderComponent } from '../../components/dashboard/dashboard-header/dashboard-header.component';
import { DelaerUsageChartComponent } from '../../components/dashboard/charts/delaer-usage-chart/delaer-usage-chart.component';
import { ActiveUsersChartComponent } from '../../components/dashboard/charts/active-users-chart/active-users-chart.component';
import { ThreadChartComponent } from '../../components/dashboard/charts/thread-chart/thread-chart.component';
import { CurrentEscalationChartComponent } from '../../components/dashboard/charts/current-escalation-chart/current-escalation-chart.component';
import { EscalationModelsComponent } from '../../components/dashboard/charts/escalation-models/escalation-models.component';
import { EscalationZonesComponent } from '../../components/dashboard/charts/escalation-zones/escalation-zones.component';
import { ContentTypeChartComponent } from '../../components/dashboard/charts/content-type-chart/content-type-chart.component';
import { GtsUsageStatusChartComponent } from '../../components/dashboard/charts/gts-usage-status-chart/gts-usage-status-chart.component';
import { GtsUsageProblemChartComponent } from '../../components/dashboard/charts/gts-usage-problem-chart/gts-usage-problem-chart.component';
import { OpenThreadChartComponent } from '../../components/dashboard/charts/open-thread-chart/open-thread-chart.component';
import { ClosedThreadChartComponent } from '../../components/dashboard/charts/closed-thread-chart/closed-thread-chart.component';
import { ZoneActivityChartComponent } from '../../components/dashboard/charts/zone-activity-chart/zone-activity-chart.component';
import { AreaActivityChartComponent } from '../../components/dashboard/charts/area-activity-chart/area-activity-chart.component';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { LeaderboardComponent } from 'src/app/components/dashboard/leaderboard/leaderboard.component';
import { UserActivitiesComponent } from 'src/app/components/dashboard/user-activities/user-activities.component';
import { TechsupportMetricsComponent } from 'src/app/components/dashboard/techsupport/techsupport-metrics/techsupport-metrics.component';
import { ManufactureChartComponent } from 'src/app/components/dashboard/manufacture-chart/manufacture-chart.component';
import { MakeChartComponent } from '../../components/dashboard/charts/make-chart/make-chart.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashFilterComponent,
    UsertypesComponent,
    AreasComponent,
    TerritoriesComponent,
    TownsComponent,
    DealersComponent,
    ThreadUsersComponent,
    IndexComponent,
    DashboardHeaderComponent,
    DelaerUsageChartComponent,
    ActiveUsersChartComponent,
    ThreadChartComponent,
    OpenThreadChartComponent,
    ClosedThreadChartComponent,
    CurrentEscalationChartComponent,
    ZoneActivityChartComponent,
    AreaActivityChartComponent,
    EscalationModelsComponent,
    EscalationZonesComponent,
    ContentTypeChartComponent,
    GtsUsageStatusChartComponent,
    GtsUsageProblemChartComponent,
    DealerUsageComponent,
    ThreadComponent,
    EscalationByModelsComponent,
    EscalationByRegionComponent,
    MonthlyEscalationsComponent,
    ActiveEscalationsComponent,
    ServiceProbingComponent,
    ZoneMetricsComponent,
    AreaMetricsComponent,
    UserActivityComponent,
    GtsUsageComponent,
    GtsDealerComponent,
    LeaderboardComponent,
    UserActivitiesComponent,
    TechsupportMetricsComponent,
    ManufactureChartComponent,
    MakeChartComponent
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule,
    MatExpansionModule
  ],
  providers: [DashboardService]
})
export class DashboardModule { }
