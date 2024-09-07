import { Component, Input , SimpleChanges } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};



@Component({
  standalone: true,
  imports: [NgApexchartsModule],
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  @Input() batteryCharges: any[] = [];
  public chartOptions: Partial<ChartOptions>;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['batteryCharges']) {
      this.updateChart();
    }
  }

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "High - 2013",
          data: [28, 29, 33, 36, 32, 32, 33]
        },
        {
          name: "Low - 2013",
          data: [12, 11, 14, 18, 17, 13, 13]
        }
      ],
      chart: {
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      colors: ["#77B6EA", "#545454", "#53B84C"],
      dataLabels: {
        enabled: true,
        offsetY: -10,
        background: {
          enabled: false,
        },
        style: {
          fontSize: '12px', // Font size
          fontWeight: 'normal',
          colors: ['#333'] // Text color
        }
      },
      stroke: {
        curve: "smooth",
        width: 2 // Adjust the line width here
      },
      title: {
        text: "Cost|Duration|Charge",
        align: "left"
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      markers: {
        size: 6, // Adjust the size of the markers here
        strokeWidth: 0, // Optional: Remove marker stroke
        strokeColors: "#fff", // Optional: Marker stroke color
        shape: "circle", // Set marker shape to circle
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        title: {
          text: "Month"
        }
      },
      yaxis: {
        title: {
          text: "Values"
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };
  }

  private updateChart() {
    // Extract categories (dates) and data for duration and charge
    const dates = this.batteryCharges.map(charge => charge.date);
    const durationData = this.batteryCharges.map(charge => charge.duration);
    const costs = this.batteryCharges.map(charge => charge.cost);
    const chargeData = this.batteryCharges.map(charge => charge.final - charge.initial);
  
    // Update chart options
    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          name: "Duration",
          data: durationData
        },
        {
          name: "Charge",
          data: chargeData
        },
        {
          name: "Cost",
          data: costs
        }
      ],
      xaxis: {
        categories: dates,
        title: {
          text: "Date"
        }
      }
    };

    console.log(this.chartOptions)
  }
}
