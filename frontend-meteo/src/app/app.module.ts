import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { LogService } from './services/log.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';
import { LoaderService } from './services/loader.service';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    NgApexchartsModule,
  ],
  declarations: [AppComponent, LoaderComponent],
  providers: [ApiService, LogService, LoaderService],
  bootstrap: [AppComponent],
})
export class AppModule {}
