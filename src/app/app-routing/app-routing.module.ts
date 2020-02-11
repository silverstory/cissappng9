import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { HomeComponent } from '../home/home.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard], pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// Reloading current route in Angular 5
// There are two possible values for onSameUrlNavigation ’reload’ or false. The default value is false, causing nothing to happen when the router is asked to navigate to the active route. We want to set this value to reload. It is worth noting reload does not actually do the work of reloading the route, it only re-triggers events on the router that we then need to hook into.
// To determine how those events are actually fired, you need to specify the runGuardsAndResolvers configuration option on your route. This can take one of three values
// paramsChange — only fire when route params have changed e.g. where the id in /user/:id changes
// paramsOrQueryParamsChange — fire when a route param changes or a query param changes. e.g. the id or the limit property change in /user/:id/invites?limit=10
// always — Always fire when the route is navigated
// With these two changes your router is configured. The next step is to handle the events that your router will produce within one of your components. To do this you will need to import the Router into your component and then hook into the events of interest. In this example, I have hooked into the NavigationEnd event which is fired once the router has completed its navigation from one route to another. Due to the way we have configured the app, this will now fire even if you try to navigate to the current route.