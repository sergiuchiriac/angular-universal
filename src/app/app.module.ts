import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { AngularFireModule } from '@angular/fire/compat';

const config = {
  apiKey: "YOUR-KEY",
  authDomain: "YOUR-KEY",
  projectId: "YOUR-KEY",
  storageBucket: "YOUR-KEY",
  messagingSenderId: "YOUR-KEY",
  appId: "YOUR-KEY",
  measurementId: "YOUR-KEY"
}

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    AngularFireModule.initializeApp(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
