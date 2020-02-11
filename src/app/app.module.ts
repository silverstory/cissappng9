import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AppComponent } from './app.component';

// the scanner!
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { AppMaterialModule } from './app-material/app-material.module';
import { registerLocaleData } from '@angular/common';
import localeEnPh from '@angular/common/locales/en-PH';
import localeEnPhExtra from '@angular/common/locales/extra/en-PH';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth/token.interceptor';
import { ProfileService } from './profile.service';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '../environments/environment';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HomeComponent } from './home/home.component';
// the second parameter 'fr' is optional
// registerLocaleData(localeFr, 'fr');
// registerLocaleData(localeFr, 'fr-FR', localeFrExtra);
registerLocaleData(localeEnPh, 'en-PH', localeEnPhExtra);

@NgModule({
  declarations: [
    AppComponent,
    ProfileDialogComponent,
    HeaderComponent,
    PageNotFoundComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // gets the scanner ready!
    ZXingScannerModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    ScrollingModule
  ],
  entryComponents: [ProfileDialogComponent],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-PH' },
      ProfileService,
      AuthService,
      AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
