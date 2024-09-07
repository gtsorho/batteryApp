import { CommonModule } from '@angular/common';
import { Component, HostListener  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';
import { LoaderService } from '../main/loader.service';
import { ClientService } from '../main/individual/client.service';

interface credentials {
  username: string;
  password: string;
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  searchCertificates: any
  isSearchLoader: boolean = false;

  constructor(private router: Router, public loaderService: LoaderService, private ClientService: ClientService) { }
  private baseUrl = this.loaderService.baseUrl()
  token: string = ''
  verify: boolean = false
  findAllCert: boolean = false;
  credentials: credentials = {
    username: '',
    password: ''
  };
  ghana_cardNo: string = ''
  certificateVal: string = ''
  certificate: any
  certificates: any = []
  isLoader: boolean = false
  msg: any;
  isMsg: any = false
  isDropdownOpen = false;
  searchValue:string = ''


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  login() {
    this.isLoader = true
    axios.post(this.baseUrl + '/users/login', this.credentials)
      .then((response) => {
        this.setCookie('token', response.data.token, 1);
        this.router.navigate(['/main/client']);
        this.isLoader = false
      })
      .catch(error => {
        console.log(error);
        this.isLoader = false
        this.isMsg = true
        this.msg = error.response.data.message
        setInterval(() => {
          this.isMsg = false
        }, 3000);
      });
  }


  setCookie(cname: string, cvalue: string, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const dropdownButton = document.getElementById('dropdown-button');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (dropdownButton && dropdownMenu && !dropdownButton.contains(target) && !dropdownMenu.contains(target)) {
      this.isDropdownOpen = false;
    }
  }

}