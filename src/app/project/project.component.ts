import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
declare var $: any;
import { UsersService, AuthenticationService, ApiService } from "../services";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { MustMatch } from "../helpers";
import { CountryISO, PhoneNumberFormat, SearchCountryField } from "ngx-intl-tel-input";

@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit, AfterViewInit {

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  projectsList: any = [];
  projectsPlanList:any=[]
  addProject: FormGroup;
  uploadForm: FormGroup;
  submitted = false;
  modelStyle: string = "";
  roles: any = [];
  selectedPlan: string = 'default';
  statusType: string = "ALL";
  currentPage: any = 1;
  deleteProjectId: any = null;
  totalPage: any = 0;
  attachmentModelStyle: string = "";
  seachValue: string = "";
  sortingBy: string = "name";
  sortingByValue: string = "asc";
  isSorting: boolean = false;
  currentOrder: boolean = true;
  permissons: any = [];
  updateUser: any = {};
  modityPermissions: any = [];
  singleUser: any = {};
  images: any[] = [];
  videos: any[] = [];
  imageUrl2: string[] = [];
  imageUrlAll: string[] = [];
  constructor(
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    private router: Router,
    protected SERVER: ApiService,
    private cd:ChangeDetectorRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
  ) { 
    this.uploadForm = this.formBuilder.group({
      image: ['', Validators.required],
      video: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.modelStyle = "none";
    // this.getProjectPlans()
    this.getProjects();
    // this.getRoles();

  }
  ngAfterViewInit(): void {
    $(document).on("click", ".showDropdown", function () {
      $(this).closest(".dropdown-dots").find(".dropdown-content").toggle();
    });
  }
  onKeyPress(event: KeyboardEvent): void {
    const inputValue = (event.target as HTMLInputElement).value;
    if (event.target && event.target['selectionStart'] === 0 && /[0-9\s]/.test(event.key)) {
      event.preventDefault();
    } else if (event.key === " ") {
      event.preventDefault();
    }
  }
  onReset() {
    this.submitted = false;
    this.attachmentModelStyle = "none"
    this.addProject.reset();
  }
  get f(): { [key: string]: AbstractControl } {
    return this.addProject.controls;
  }
 
  removeImage(index: number): void {
    this.imageUrl2.splice(index, 1); 
    this.imageUrlAll.splice(index, 1);// Remove the image at the specified index
  }
  onImageSelect(event: any) {
    this.spinner.show();
    const maxImages = 20;
    if (event.target.files.length > 0) {
      const files = event.target.files;
      if (this.imageUrl2.length + files.length > maxImages) {
        this.toastr.error("error!", "Max 20 images allowed!");
        return;
      }
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
  
        // Upload file to the server
        const formdata = new FormData();
        formdata.append("file", file, file.name);
  
        this.SERVER.POST_DATA_WITH_HEADER_PROFILE_UPLOAD(
          this.SERVER.END_POINT.uploadFile,
          formdata,
        ).subscribe((res) => {
          // console.log(res)
          this.imageUrlAll.push(res.data.file.original);
          // Handle response here if needed
          // For example, you can update an array of uploaded file URLs
        });
        this.spinner.hide();
        // Display preview of the selected image
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
          this.imageUrl2.push(e.target.result);
        };
      }
    }
    this.spinner.hide();
  }

  onSubmit() {
    if (this.addProject.invalid) {
      this.submitted = true;
      return
    }
    if(this.imageUrl2.length !== this.imageUrlAll.length)
      {
        this.toastr.error("error!", "Wait Images are uploading now!");
        return
      }
    this.spinner.show();
    this.attachmentModelStyle = "none"
    var payload = 
    {
      "projectName": this.addProject.value.projectName,
      "registrationDate": this.addProject.value.registrationDate,
      "registryDate": this.addProject.value.registryDate,
      "constructionStartDate": this.addProject.value.constructionStartDate,
      "locationText": this.addProject.value.location,
      "projectPlanId": this.addProject.value.plan,
      "plotSizeLength":this.addProject.value.plotSizeLength,
      "plotSizeBredth": this.addProject.value.plotSizeBredth,
      "sizeInGaj": this.addProject.value.sizeInGaj,
      "constructionEstimate": this.imageUrlAll,
      "location": {
        "coordinates": [40.7128, -74.0060]
      },
      "amount": {
        "totalAmount": this.addProject.value.totalAmount,
        "loanAmount": this.addProject.value.loanAmount,
        "downpayment": this.addProject.value.downpayment,
        "emiAmount": this.addProject.value.emiAmount
      },
      "customer": {
        "countryCode": this.addProject.value.phoneNumber.dialCode,
        "phoneNumber": this.addProject.value.phoneNumber.number,
        "password": this.addProject.value.password,
        "name":this.addProject.value.customerName
      },
      "supervisor": {
        "countryCode": this.addProject.value.supervisorPhoneNumber.dialCode,
        "phoneNumber": this.addProject.value.supervisorPhoneNumber.number,
        "name":this.addProject.value.supervisorName
      }

    }
    
    // console.log(payload)
    this.SERVER.POST_DATA2(
      this.SERVER.END_POINT.addProject,
      payload,
    ).subscribe((res) => {
      this.spinner.hide();
      this.toastr.success("Success!", "Project Created!");
      this.attachmentModelStyle="none"
      this.getProjects();
      this.getProjectPlans()
      this.addProject.reset();
    },
    (error) => {
      console.error('Error:', error);
      this.spinner.hide();
    }
  );
    
  }
  getProjects() {
    this.spinner.show();
    var payload = {
      page: this.currentPage,
      pageSize: 10,
    };
    if (this.seachValue) {
      payload["search"] = this.seachValue;
    }
    if (this.isSorting) {
      payload["sortBy"] = this.sortingBy;
      payload["sortOrder"] = this.sortingByValue;
    }
   
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getprojects,
      payload,
      true,
    ).subscribe((res) => {
      // console.log(res)
      this.projectsList = res.data.projects;
      // console.log(this.projectsList)
      this.totalPage = Math.ceil(res.data.totalCount / 10);
            this.spinner.hide();
     
    });
  }
  getProjectPlans() {
    // this.spinner.show();
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getProjectPlans,
      true,
    ).subscribe((res) => {
      // console.log(res)
      this.projectsPlanList = res?.data?.plans;
      this.selectedPlan=res?.data?.plans[0]?._id
      // console.log(this.projectsPlanList)
      // this.spinner.hide();
    });
  }
  openDeleteModel(item: any) {
    this.modelStyle = "block";
    this.deleteProjectId = item;
  }
  closeModel() {
    this.modelStyle = "none";
  }
  // deleteUser() {
  //   var payload = {
  //     _id: this.deleteProjectId,
  //   };
  //   this.SERVER.DELETE_DATA(
  //     this.SERVER.END_POINT.deleteProject,
  //     payload,
  //   ).subscribe((res) => {
  //     this.toastr.success("Success!", "Project is Deleted");
  //     this.modelStyle = "none";
  //     this.getProjects();
  //   });
  // }
  onDeleteProduct(): void {
    this.modelStyle = "none";
    this.SERVER.deleteProduct(this.deleteProjectId)
      .subscribe(
        response => {
          this.toastr.success("Success!", "Project is Deleted");
          
          this.getProjects();
          // console.log('Product deleted successfully:', response);
          // Add any additional logic after successful deletion
        },
        error => {
          // console.error('Error deleting product:', error);
          // Handle error as needed
        }
      );
  }
  loadAdmins(filter: string) {
    this.statusType = filter;
    this.getProjects();
  }

  paginationAndSorting(pagination: string) {
    if (pagination == "NEXT") {
      this.currentPage = this.currentPage + 1;
    } else if (pagination == "PREVIOUS") {
      this.currentPage = this.currentPage - 1;
    }

    this.getProjects();
  }
  // seach(event: any) {
  //   this.seachValue = event.target.value.trim();
  //   if (this.seachValue.length > 3 || this.seachValue == "") {
  //     this.getProjects();
  //   }
  // }
  seach(event: any) {
    this.seachValue = event.target.value.trim();
    if (this.seachValue.length > 3 || this.seachValue === "") {
      // Extract last 10 digits if the search value contains a "+"
      if (this.seachValue.includes('+')) {
        this.seachValue = this.seachValue.substr(this.seachValue.length - 10);
      }

      this.currentPage = 1;
      this.getProjects();
    }
  }
  restrickedWord(event: KeyboardEvent) {
    const allowedKeys = /[a-zA-Z0-9\b]/; // Regular expression to match alphanumeric characters and backspace (\b)
    const inputChar = String.fromCharCode(event.keyCode);
    if (!allowedKeys.test(inputChar)) {
      // If the entered character is not alphanumeric or backspace, prevent the default action
      event.preventDefault();
    }
  }
  resetForm() {
    this.attachmentModelStyle = "block"
    // console.log("clicked")
    let telInput: HTMLInputElement | null = document.querySelector('input[type="tel"]');
    telInput.style.border = '1px solid #6c757d';
    telInput.style.height = '42px';
    telInput.style.borderRadius = '5px';
    telInput.style.width = '100%';
    this.submitted = false;

  }
  attacmentCloseModel() {
    this.attachmentModelStyle = "none"
  }
  sorting(sortingBy: string) {
    this.isSorting = true;
    this.sortingBy = sortingBy;
    this.currentOrder = !this.currentOrder;
    this.sortingByValue = this.currentOrder ? "asc" : "desc";
    this.getProjects();
  }
  getPermissions() {
    var payload = {
      page: 1,
      pageSize: 20,
    };
    this.SERVER.GET_DATA2(
      this.SERVER.END_POINT.getPermissionMenus,
      payload,
      true,
    ).subscribe((res) => {
      this.permissons = res.data.totalUsers;
    });
  }
  noWhitespaceValidator(control) {
    if (control.value && (control.value.trimStart() === control.value || control.value.length === 0)) {
      return null; // no whitespace at the beginning, return null (no error)
    } else {
      return { startsWithSpace: true }; // whitespace detected, return an error object
    }
  }
  noWhitespaceValidator2(control) {
    if (control.value && /^\s/.test(control.value)) {
      return { startsWithSpace: true }; // whitespace detected, return an error object
    } else {
      return null; // no whitespace at the beginning, return null (no error)
    }
  }
  customPasswordValidator(control) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(control.value) ? null : { invalidPassword: true };
  }
  calculateSizeInGaj(): void {
    const plotSizeLength = this.addProject.get('plotSizeLength').value;
    const plotSizeBredth = this.addProject.get('plotSizeBredth').value;
    
    // Assuming 1 gaj = 1 square meter
    const sizeInGaj = (plotSizeLength * plotSizeBredth) / 9;
  
    // Update the value of Size In Gaj form control
    this.addProject.get('sizeInGaj').setValue(sizeInGaj);
  }
  changeAdminStatus(status: string, _id: string) {
    this.updateUser = {
      user_id: _id,
      status: status,
    };
  }

  updateUserStatus() {
    var payload = {
      isActive: this.updateUser.status == "enable" ? "true" : "false",
      _id: this.updateUser.user_id,
    };
    this.SERVER.POST_DATA2(
      this.SERVER.END_POINT.updatedUserInfo,
      payload,
    ).subscribe((res) => {
      if (this.updateUser.status == "enable") {
        $("#enable").modal("hide");
        this.updateUser["userAction"] = "Enabled";
      } else {
        $("#disable").modal("hide");
        this.updateUser["userAction"] = "Disabled";
      }
      $("#documentModalSuccess").modal("show");
      this.getProjects();
    });
  }
  modifyPermission(event: any, item: any) {
    var obj = {
      menuId: item._id,
      menuName: item.manuName,
      slug: item.slug,
      hasPermission: true,
      _id: item._id,
    };
    if (this.modityPermissions.length) {
      var permisionIndex = this.modityPermissions.findIndex(
        (x) => x.menuId === item._id,
      );
      if (permisionIndex >= 0) {
        if (event.target["checked"]) {
          this.modityPermissions.push(obj);
        } else {
          this.modityPermissions.splice(permisionIndex, 1);
        }
      } else {
        this.modityPermissions.push(obj);
      }
    } else {
      this.modityPermissions.push(obj);
    }
  }

 
  customEmailValidator(control) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(control.value) ? null : { invalidEmail: true };
  }
}