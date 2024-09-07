import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LoaderService } from '../loader.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import axios from 'axios';
import { FormsModule } from '@angular/forms';
import { ClientService } from './client.service';
import { LoginService } from '../../login/login.service';
import { ChartComponent } from "./chart/chart.component";

interface Client {
  id?: number,
  client: string,
  phone: string,
  location: string,
  BatteryCharges?:any
}

interface BatteryCharge {
  id?: number,
  startTime: string,
  endTime: string,
  duration: number,
  date: string,
  cost: string,
  ClientId: number,
  initial:number, 
  final:number
}

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ChartComponent],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit, OnDestroy, AfterViewInit {
  isChart: boolean = false
  shortDate(dateString:string) {
    const date = new Date(dateString);
  
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }
  
    const shortDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  
    return shortDate;
  }


getView() {
  this.isChart = true
}

  client: Client = {
    client: '',
    phone: '',
    location: ''
  }
  clickListener: any;
  openTab=2;
  token: string = "";
  baseUrl: string = this.loaderService.baseUrl()
  clients: Client[] = [];
  showSubTable: boolean[] = [];
  isOpen = false;
  options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  selectedOptions: {
    id: number,
    checked: boolean
  }[] = [];
  selectedClient: number = 0;
  batteryCharges: BatteryCharge[] = [];
  selectedBatteryCharge: number = 0;
  prefix: string = '';
  batteryCharge: BatteryCharge = {
    startTime: '',
    endTime: '',
    duration: 0,
    date: '',
    cost: '',
    ClientId: 0,
    initial:0,
    final:0
  }
  uploadForm: FormGroup;
  file: File | null = null;

  @ViewChild('myElement') elementRef!: ElementRef;
  isLoader: boolean = false;
  isUploadLoader: boolean = false;
  isMsg: boolean = false;
  msg: any;
  viewClient:any = 'default';

  constructor(private loaderService: LoaderService,
    private loginService: LoginService,
    private clientService:ClientService,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef) {
    this.clients = [];
    this.showSubTable = new Array(this.clients.length).fill(false);
    this.uploadForm = this.fb.group({
      file: [null, Validators.required],
      client: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.token = this.getCookie('token');
    this.getClients();
    this.loginService.getDecodedToken();
  }

  ngAfterViewInit(): void {
    this.clickListener = this.renderer.listen('document', 'click', (event) => {
      if (this.elementRef && !this.elementRef.nativeElement.contains(event.target) && !event.target.closest('.dropdown-toggle')) {
        this.isOpen = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.clickListener) {
      this.clickListener();
    }
  }

  createClient() {
    this.isLoader = true;
    axios.post(this.baseUrl + '/clients', this.client, {
      headers: { 'authorization': 'Bearer ' + this.token }
    }).then((response) => {
      this.getClients();
      this.client = {
        client: '',
        phone: '',
        location: ''
      };
      this.isLoader = false;
    }).catch((error) => {
      console.log(error);
      this.isMsg = true;
      this.msg = error
      setTimeout(() => {
        this.isMsg = false;
      }, 3000);
    });
  }

  createBatteryCharge() {
    this.isLoader = true;
    this.batteryCharge.ClientId = this.selectedClient;

    axios.post(this.baseUrl + '/battery_charge', this.batteryCharge, {
      headers: { 'authorization': 'Bearer ' + this.token }
    }).then((response) => {
      this.getClients(); // Assuming battery charges are fetched with client data
      this.batteryCharge = {
        startTime: '',
        endTime: '',
        duration: 0,
        date: '',
        cost: '',
        ClientId: 0,
        initial:0,
        final:0
      };
      this.isLoader = false;
    }).catch((error) => {
      console.log(error);
      this.isMsg = true;
      this.msg = error.response.data.error;
      setTimeout(() => {
        this.isMsg = false;
        this.isLoader = false
      }, 3000);
    });
  }

  getClients() {
    this.clientService.getClients().subscribe((data) => {
      this.clients = data;
      console.log(data)
      this.initializeSelectedOptions();
    });
  }

  toggleSubTable(index: number): void {
    this.showSubTable[index] = !this.showSubTable[index];
  }

  // getBatteryCharges() {
  //   if (this.selectedClient) {
  //     const client = this.clients.find(c => c.id === +this.selectedClient);
  //     this.batteryCharges = client ? client.BatteryCharges : [];
  //   }
  // }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  initializeSelectedOptions() {
    this.selectedOptions = this.clients.map(client => ({
      id: client.id || 0,
      checked: false
    }));
  }

  getSelectedClients(): string {
    const selected = this.clients
      .filter((_, index) => this.selectedOptions[index].checked)
      .map(client => client.client);
    return selected.length > 0 ? selected.join(', ') : 'Select Client';
  }

  getCookie(cname: string) {
    let name = cname + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  calculateDuration() {
    // Convert the times to Date objects
    const start:any = new Date(`1970-01-01T${this.batteryCharge.startTime}:00`);
    const end:any = new Date(`1970-01-01T${this.batteryCharge.endTime}:00`);
    
    // Calculate the difference in milliseconds
    const diffInMs = end - start;
    
    // Convert milliseconds to minutes and hours
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    
    this.batteryCharge.duration = diffInMinutes
}

  
}
