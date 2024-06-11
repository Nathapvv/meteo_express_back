import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from './services/api.service';
import { delay, lastValueFrom } from 'rxjs';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public name = 'Météo Express';
  public filters = {
    location: 'Amiens',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
  };
  public carbonData: any[] = [];
  public moyCarbonIntensity = 0;
  public carbonLocation: string = '';
  public locations: any[] = [];

  constructor(
    private apiService: ApiService,
    private loaderService: LoaderService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getLocation();
    this.filters.location = this.locations[0].name;
    await this.getCarbonIntensity();
  }

  async getLocation(): Promise<void> {
    this.loaderService.show();

    try {
      const response: any = await lastValueFrom(this.apiService.getLocation());

      this.locations = response.locations;
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des données de location',
        error
      );
    } finally {
      this.loaderService.hide();
    }
  }

  async getCarbonIntensity(): Promise<void> {
    this.loaderService.show();

    try {
      const selectedLocation = this.locations.find(
        (location) => location.name === this.filters.location
      );

      if (!selectedLocation) {
        console.error('Location not found');
        return;
      }

      let copiedFilters = { ...this.filters };
      copiedFilters.location = selectedLocation;

      const response: any = await lastValueFrom(
        this.apiService.getIntensity(copiedFilters)
      );

      this.carbonLocation = response.location;
      this.carbonData = response.history.map((entry: any) => {
        const date = new Date(entry.datetime);
        return {
          date: date.toISOString().split('T')[0],
          time: date.toISOString().split('T')[1].slice(0, 5),
          intensity: entry.carbonIntensity,
        };
      });

      const filteredData = this.carbonData.filter((entry) => {
        return (
          (!this.filters.startDate || entry.date >= this.filters.startDate) &&
          (!this.filters.endDate || entry.date <= this.filters.endDate) &&
          (!this.filters.startTime || entry.time >= this.filters.startTime) &&
          (!this.filters.endTime || entry.time <= this.filters.endTime)
        );
      });

      if (filteredData.length > 0) {
        this.moyCarbonIntensity =
          filteredData.reduce((sum, entry) => sum + entry.intensity, 0) /
          filteredData.length;
      } else {
        this.moyCarbonIntensity = 0;
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données d'intensité carbone",
        error
      );
    } finally {
      this.loaderService.hide();
    }
  }
}
