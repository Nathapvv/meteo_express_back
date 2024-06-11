import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from './services/api.service';
import { delay, lastValueFrom } from 'rxjs';
import { LoaderService } from './services/loader.service';
import { Title } from '@angular/platform-browser';

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
  public indicateur: number = 100;
  public locations: string[] = [
    'Tokyo',
    'Delhi',
    'Shanghai',
    'Sao Paulo',
    'Mexico City',
    'Cairo',
    'Mumbai',
    'Beijing',
    'Amiens',
    'Dhaka',
    'Osaka',
    'New York',
    'Karachi',
    'Buenos Aires',
    'Chongqing',
    'Istanbul',
    'Kolkata',
    'Manila',
    'Lagos',
    'Rio de Janeiro',
    'Tianjin',
    'Kinshasa',
    'Guangzhou',
    'Los Angeles',
    'Moscow',
    'Shenzhen',
    'Lahore',
    'Bangalore',
    'Paris',
    'Bogotá',
    'Jakarta',
    'Chennai',
    'Lima',
    'Bangkok',
    'Seoul',
    'Nagoya',
    'Hyderabad',
    'London',
    'Tehran',
    'Chicago',
    'Chengdu',
    'Nanjing',
    'Wuhan',
    'Ho Chi Minh City',
    'Luanda',
    'Ahmedabad',
    'Kuala Lumpur',
    'Xi’an',
    'Hong Kong',
    'Dongguan',
    'Hangzhou',
    'Marseille',
    'Lyon',
    'Toulouse',
    'Nice',
    'Nantes',
    'Strasbourg',
    'Montpellier',
    'Bordeaux',
    'Lille',
    'Rennes',
    'Reims',
    'Le Havre',
    'Saint-Étienne',
    'Toulon',
    'Angers',
    'Grenoble',
    'Dijon',
    'Nîmes',
    'Aix-en-Provence',
    'Saint-Quentin',
  ];

  constructor(
    private apiService: ApiService,
    private loaderService: LoaderService,
    private title: Title
  ) {
    title.setTitle('Météo Express');
  }

  async ngOnInit(): Promise<void> {
    this.loadMetedata();
    await this.getCarbonIntensity();
  }

  private loadMetedata() {
    const savedIntensity = localStorage.getItem('maxIntensity');
    if (savedIntensity !== null) {
      this.indicateur = +savedIntensity;
    }
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

  public onIntensityChange(): void {
    localStorage.setItem('maxIntensity', this.indicateur.toString());
  }

  async getCarbonIntensity(): Promise<void> {
    this.loaderService.show();

    try {
      const response: any = await lastValueFrom(
        this.apiService.getMeteoData(
          this.filters.location,
          0,
          this.filters.startTime,
          this.filters.endTime
        )
      );

      this.carbonLocation = this.filters.location;
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
