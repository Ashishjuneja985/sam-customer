import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { AuthenticationService, ApiService } from "../services";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'profile-change-password',
  templateUrl: './profile-change-password.component.html',
  styleUrls: ['./profile-change-password.component.css']
})
export class ProfileChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  showPassword: boolean = false;
  showPassword3: boolean = false;
  showConfirmPassword: boolean = false;
  strong: string = "";
  error = "";
  response: any;
  accessToken: string = "";
  constructor(  private location: Location,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private SERVER: ApiService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.accessToken = localStorage.getItem("accessToken");
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ["", [Validators.required]],
      newPassword: ["", [Validators.required, Validators.minLength(8),this.customPasswordValidator]],
      confirmPassword: [
        "",
        [Validators.required],
      ],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    if(this.changePasswordForm.value.newPassword === this.changePasswordForm.value.confirmPassword)
    {
      var payload = 
      {
        "oldPassword":this.changePasswordForm.value.oldPassword,
        "newPassword":this.changePasswordForm.value.newPassword
    }
    // console.log(payload)
    this.SERVER.REJECT_DOCUMENT(this.SERVER.END_POINT.adminChangePassword,payload )
      .subscribe((res) => {
        this.toastr.success("Success!", "Password Changed");
        this.changePasswordForm.reset()
        this.router.navigate(["/"]);
      },
        (error) => {
          this.error = error;
          this.loading = false;
        },
      );
    }else {
      this.toastr.error("", "Confirm password did not match with New password");
      return
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === " ") {
      event.preventDefault();
    }
  }
  customKeyUp() {
    let strength = 0;
    let passwordValue = this.changePasswordForm.value.newPassword;
    if (passwordValue) {
      // Add points for uppercase letters
      const upperCaseRegex = /[A-Z]/g;
      if (upperCaseRegex.test(passwordValue)) {
        strength += 1;
      }

      // Add points for lowercase letters
      const lowerCaseRegex = /[a-z]/g;
      if (lowerCaseRegex.test(passwordValue)) {
        strength += 1;
      }

      // Add points for numbers
      const numberRegex = /[0-9]/g;
      if (numberRegex.test(passwordValue)) {
        strength += 1;
      }

      // Add points for special characters
      const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
      if (specialCharRegex.test(passwordValue)) {
        strength += 1;
      }
    }
    if (strength === 1) {
      this.strong = "Poor";
    } else if (strength === 2) {
      this.strong = "Week";
    } else if (strength === 3) {
      this.strong = "Medium";
    } else if (strength === 4) {
      this.strong = "Strong";
    } else {
      this.strong = "";
    }
  }
  getStrongStyle() {
    switch (this.strong) {
      case "Poor":
        return { color: "red" };
      case "Week":
        return { color: "yellow" };
      case "Medium":
        return { color: "orange" };
      case "Strong":
        return { color: "green" };
      default:
        return {};
    }
  }
  
  
  togglePasswordVisibility(value) {
    if (value === 1) {
      this.showPassword = !this.showPassword;
    } else if (value === 2) {
      this.showConfirmPassword = !this.showConfirmPassword;
    } else if (value === 3) {
      this.showPassword3 = !this.showPassword3;
    }

  }
  customPasswordValidator(control) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(control.value) ? null : { invalidPassword: true };
  }
  goBack(): void {
    this.location.back();
  }
}
