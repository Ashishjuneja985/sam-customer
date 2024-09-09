import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import { AuthenticationService } from "../services";
import { CountryISO, PhoneNumberFormat, SearchCountryField } from "ngx-intl-tel-input";
import { Location } from '@angular/common';

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  fcmToken: string;
  showPassword: boolean = false;
  submitted = false;
  screenNumber:number=1;
  returnUrl: string;
  error = "";
  fullUrl:string="";
  fullUrlWithParams:string="";
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private location: Location
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    // let telInput: HTMLInputElement | null = document.querySelector('input[type="tel"]');
    // telInput.style.border = '1px solid #6c757d';
    // telInput.style.height = '42px';
    // telInput.style.borderRadius = '5px';
    // telInput.style.backgroundColor="#efefe"
    // telInput.style.width = '100%';

    this.loginForm = this.formBuilder.group({
      phoneNumber: ["", Validators.required],
      password: ["", Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    this.fullUrl = this.location.prepareExternalUrl(this.router.url);

    // Or if you need the full URL including query parameters
     this.fullUrlWithParams = window.location.href;

   
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    // console.log('clicked')
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.route.queryParams.subscribe(params => {
      this.fcmToken =  JSON.parse(localStorage.getItem('fcmToken')) // Extract the FCM token from query params
    });
    this.loading = true;
    this.authenticationService
      .login(this.loginForm.value.phoneNumber.dialCode,this.loginForm.value.phoneNumber.number, this.loginForm.value.password,this.fcmToken)
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate(["/dashboard"]);
          this.loading = false;
        },
        (error) => {
          this.error = error;
          this.loading = false;
        },
      );
  }
  showLoginScreen(screen:number)
  {
    if(screen === 1)
    {
      this.screenNumber=2
    }else if(screen === 2)
    {
      this.screenNumber=3
    }else if(screen === 3)
      {
        this.screenNumber=4
      }else if(screen === 4)
        {
          this.screenNumber=5
        }

  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  
}
}
