export class routes {

  private static Url = '';

  public static get baseUrl(): string {
    return this.Url;
  }
  public static get changePassword2(): string {
    return this.baseUrl + '/change-password2';
  }
  public static get forgotPassword(): string {
    return this.baseUrl + '/forgot-password';
  }
  public static get lockScreen(): string {
    return this.baseUrl + '/lock-screen';
  }
  public static get login(): string {
    return this.baseUrl + '/login';
  }
  public static get register(): string {
    return this.baseUrl + '/register';
  }
  public static get addPayment(): string {
    return this.baseUrl + '/accounts/add-payment';
  }
  // public static get expenses(): string {
  //   return this.baseUrl + '/accounts/expenses';
  // }
  public static get addExpense(): string {
    return this.baseUrl + '/accounts/add-expense';
  }
  public static get editExpense(): string {
    return this.baseUrl + '/accounts/edit-expense';
  }
  public static get invoices(): string {
    return this.baseUrl + '/accounts/invoices';
  }
  public static get invoiceView(): string {
    return this.baseUrl + '/accounts/invoice-view';
  }
  public static get payments(): string {
    return this.baseUrl + '/accounts/payments';
  }
  public static get editPayment(): string {
    return this.baseUrl + '/accounts/edit-payment';
  }
  public static get providentFund(): string {
    return this.baseUrl + '/accounts/provident-fund';
  }
  public static get addProvidentFund(): string {
    return this.baseUrl + '/accounts/add-provident-fund';
  }
  public static get editProvidentFund(): string {
    return this.baseUrl + '/accounts/edit-provident-fund';
  }
  public static get taxess(): string {
    return this.baseUrl + '/accounts/taxes';
  }
  public static get addTax(): string {
    return this.baseUrl + '/accounts/add-tax';
  }
  public static get editTax(): string {
    return this.baseUrl + '/accounts/edit-tax';
  }
  public static get activities(): string {
    return this.baseUrl + '/activities';
  }
  public static get addAppointment(): string {
    return this.baseUrl + '/appointments/add-appointment';
  }
  public static get apptCalendar(): string {
    return this.baseUrl + '/appointments/appointment-calendar';
  }
  public static get appointmentList(): string {
    return this.baseUrl + '/appointments/appointment-list';
  }
  public static get calenderView(): string {
    return this.baseUrl + '/appointments/appointment-calendar';
  }
  public static get editAppointment(): string {
    return this.baseUrl + '/appointments/edit-appointment';
  }
  public static get addAsset(): string {
    return this.baseUrl + '/assets/add-asset';
  }
  public static get assetsList(): string {
    return this.baseUrl + '/assets/assets-list';
  }
  public static get editAsset(): string {
    return this.baseUrl + '/assets/edit-asset';
  }
  public static get blankPage(): string {
    return this.baseUrl + '/blank-page';
  }
  public static get addBlog(): string {
    return this.baseUrl + '/blogs/add-blog';
  }
  public static get blog(): string {
    return this.baseUrl + '/blogs/blog';
  }
  public static get blogDetails(): string {
    return this.baseUrl + '/blogs/blog-details';
  }
  public static get editBlog(): string {
    return this.baseUrl + '/blogs/edit-blog';
  }
  public static get calendar(): string {
    return this.baseUrl + '/calendar';
  }
  public static get incomingCall(): string {
    return this.baseUrl + '/calls/incoming-call';
  }
  public static get videoCall(): string {
    return this.baseUrl + '/calls/video-call';
  }
  public static get voiceCall(): string {
    return this.baseUrl + '/calls/voice-call';
  }
  public static get chat(): string {
    return this.baseUrl + '/chat';
  }
  public static get tabs(): string {
    return this.baseUrl + '/components/tabs';
  }
  public static get typography(): string {
    return this.baseUrl + '/components/typography';
  }
  public static get uikit(): string {
    return this.baseUrl + '/components/uikit';
  }
  public static get adminDashboard(): string {
    return this.baseUrl + '/dashboard/admin-dashboard';
  }
  public static get doctorDashboard(): string {
    return this.baseUrl + '/dashboard/doctor-dashboard';
  }
  public static get patientDashboard(): string {
    return this.baseUrl + '/dashboard/patient-dashboard';
  }
  public static get addDepartment(): string {
    return this.baseUrl + '/departments/add-department';
  }
  public static get departmentList(): string {
    return this.baseUrl + '/departments/department-list';
  }
  public static get editDepartment(): string {
    return this.baseUrl + '/departments/edit-department';
  }
  public static get addDoctor(): string {
    return this.baseUrl + '/doctor/add-doctor';
  }
  public static get doctorProfile(): string {
    return this.baseUrl + '/doctor/doctor-profile';
  }
  public static get doctorSetting(): string {
    return this.baseUrl + '/doctor/doctor-setting';
  }
  public static get doctorsList(): string {
    return this.baseUrl + '/doctor/doctors-list';
  }
  public static get editDoctor(): string {
    return this.baseUrl + '/doctor/edit-doctor';
  }
  public static get addSchedule(): string {
    return this.baseUrl + '/doctor-schedule/add-schedule';
  }
  public static get editSchedule(): string {
    return this.baseUrl + '/doctor-schedule/edit-schedule';
  }
  public static get schedule(): string {
    return this.baseUrl + '/doctor-schedule/schedule';
  }
  public static get email(): string {
    return this.baseUrl + '/email';
  }
  public static get compose(): string {
    return this.baseUrl + '/email/compose';
  }
  public static get confirmMail(): string {
    return this.baseUrl + '/email/confirm-mail';
  }
  public static get inbox(): string {
    return this.baseUrl + '/email/inbox';
  }
  public static get mailView(): string {
    return this.baseUrl + '/email/mail-view';
  }
  public static get forms(): string {
    return this.baseUrl + '/forms';
  }
  public static get formBasicInputs(): string {
    return this.baseUrl + '/forms/form-basic-inputs';
  }
  public static get formHorizontal(): string {
    return this.baseUrl + '/forms/form-horizontal';
  }
  public static get formInputGroups(): string {
    return this.baseUrl + '/forms/form-input-groups';
  }
  public static get formVertical(): string {
    return this.baseUrl + '/forms/form-vertical';
  }
  public static get gallery(): string {
    return this.baseUrl + '/gallery';
  }
  public static get addInvoice(): string {
    return this.baseUrl + '/invoice/add-invoice';
  }
  public static get createInvoice(): string {
    return this.baseUrl + '/invoice/create-invoice';
  }
  public static get editInvoice(): string {
    return this.baseUrl + '/invoice/edit-invoice';
  }
  public static get editInvoices(): string {
    return this.baseUrl + '/invoice/edit-invoices';
  }
  public static get invoicesGrid(): string {
    return this.baseUrl + '/invoice/invoices-grid';
  }
  public static get allInvoice(): string {
    return this.baseUrl + '/dashboard/admin-dashboard';
  }
  public static get invoicesCancelled(): string {
    return this.baseUrl + '/invoice/invoices-cancelled';
  }
  public static get invoicesDraft(): string {
    return this.baseUrl + '/invoice/invoices-draft';
  }
  public static get invoicesOverdue(): string {
    return this.baseUrl + '/invoice/invoices-overdue';
  }
  public static get invoicesPaid(): string {
    return this.baseUrl + '/invoice/invoices-paid';
  }
  public static get invoicesRecurring(): string {
    return this.baseUrl + '/invoice/invoices-recurring';
  }
  public static get invoicesSettings(): string {
    return this.baseUrl + '/invoice/invoices-settings';
  }
  public static get taxSettings(): string {
    return this.baseUrl + '/invoice/tax-settings';
  }
  public static get viewInvoice(): string {
    return this.baseUrl + '/invoice/view-invoice';
  }
  public static get addPatient(): string {
    return this.baseUrl + '/patient/add-patient';
  }
  public static get editPatient(): string {
    return this.baseUrl + '/patient/edit-patient';
  }
  public static get patientProfile(): string {
    return this.baseUrl + '/patient/patient-profile';
  }
  public static get patientSetting(): string {
    return this.baseUrl + '/patient/patient-setting';
  }
  public static get patientsList(): string {
    return this.baseUrl + '/patient/patients-list';
  }
  public static get salary(): string {
    return this.baseUrl + '/staff-salary';
  }
  public static get addSalary(): string {
    return this.baseUrl + '/staff-salary/add-staff-salary';
  }
  public static get editSalary(): string {
    return this.baseUrl + '/staff-salary/edit-staff-salary/:id';
  }
  public static get EmployeePayment(): string {
    return this.baseUrl + '/employee-payment';
  }
  public static get addEmployeePayment(): string {
    return this.baseUrl + '/employee-payment/add-employee-payment';
  }
  // public static get editSalary(): string {
  //   return this.baseUrl + '/employee-payment/edit-employee-payment/:id';
  // }
  public static get salaryView(): string {
    return this.baseUrl + '/payroll/salary-view';
  }
  public static get profile(): string {
    return this.baseUrl + '/profile';
  }
  public static get editProfile(): string {
    return this.baseUrl + '/edit-profile';
  }
  public static get expenseReports(): string {
    return this.baseUrl + '/reports/expense-reports';
  }
  public static get invoiceReports(): string {
    return this.baseUrl + '/reports/invoice-reports';
  }
  public static get setting(): string {
    return this.baseUrl + '/setting';
  }
  public static get settings(): string {
    return this.baseUrl + '/settings/general-settings';
  }
  public static get bankSettings(): string {
    return this.baseUrl + '/settings/bank-settings';
  }
  public static get changePassword(): string {
    return this.baseUrl + '/settings/change-password';
  }
  public static get emailSettings(): string {
    return this.baseUrl + '/settings/email-settings';
  }
  public static get localizationDetails(): string {
    return this.baseUrl + '/settings/localization-details';
  }
  public static get othersSettings(): string {
    return this.baseUrl + '/settings/others-settings';
  }
  public static get paymentSettings(): string {
    return this.baseUrl + '/settings/payment-settings';
  }
  public static get seoSettings(): string {
    return this.baseUrl + '/settings/seo-settings';
  }
  public static get socialLinks(): string {
    return this.baseUrl + '/settings/social-links';
  }
  public static get socialSettings(): string {
    return this.baseUrl + '/settings/social-settings';
  }
  public static get themeSettings(): string {
    return this.baseUrl + '/settings/theme-settings';
  }
  public static get staffList(): string {
    return this.baseUrl + '/staff';
  }
  public static get addStaff(): string {
    return this.baseUrl + '/staff/add-staff';
  }
  public static get editStaff(): string {
    return this.baseUrl + '/staff/edit-staff/:id';
  }
  public static get staffLeave(): string {
    return this.baseUrl + '/staff-leaves';
  }
  public static get addLeave(): string {
    return this.baseUrl + '/staff-leaves/add-staff-leaves';
  }
  public static get editLeave(): string {
    return this.baseUrl + '/staff-leaves/edit-staff-leaves/:id';
  }
  public static get staffAttendance(): string {
    return this.baseUrl + '/staff/staff-attendance';
  }
  public static get staffHoliday(): string {
    return this.baseUrl + '/staff/staff-holiday';
  }
  public static get staffProfile(): string {
    return this.baseUrl + '/staff/staff-profile';
  }
  public static get staffSetting(): string {
    return this.baseUrl + '/staff/staff-setting';
  }
  public static get tablesBasic(): string {
    return this.baseUrl + '/tables/tables-basic';
  }
  public static get tablesDataTables(): string {
    return this.baseUrl + '/tables/tables-datatables';
  }
  public static get error404(): string {
    return this.baseUrl + '/error/error404';
  }
  public static get error500(): string {
    return this.baseUrl + '/error/error500';
  }
  public static get providersList(): string {
    return this.baseUrl + '/settings/providers-profiles';
  }
  public static get providersView(): string {
    return this.baseUrl + '/settings/providers-profiles/view';
  }
  public static get providersEdit(): string {
    return this.baseUrl + '/settings/providers-profiles/edit';
  }
  public static get serviceLocations(): string {
    return this.baseUrl + '/settings/service-locations';
  }
  public static get warehouse(): string {
    return this.baseUrl + '/settings/warehouse';
  }
  public static get product(): string {
    return this.baseUrl + '/settings/product';
  }
  public static get calendarSettings(): string {
    return this.baseUrl + '/settings/calendar-settings';
  }
  public static get practiceInformation(): string {
    return this.baseUrl + '/settings/practice-information';
  }
  public static get practiceEdit(): string {
    return this.baseUrl + '/settings/practice-information/edit-practice';
  }
  public static get practiceAdd(): string {
    return this.baseUrl + '/settings/practice-information/add-practice';
  }
  public static get getServiceLocationList(): string {
    return this.baseUrl + '/settings/service-locations/';
  }
  public static get serviceLocationAdd(): string {
    return this.baseUrl + '/settings/service-locations/add';
  }
  public static get serviceLocationEdit(): string {
    return this.baseUrl + '/settings/service-locations/edit';
  }
  public static get addUsers(): string {
    return this.baseUrl + '/settings/users/add-users';
  }
  public static get editUsers(): string {
    return this.baseUrl + '/settings/users/edit-users';
  }
  public static get listUsers(): string {
    return this.baseUrl + '/settings/users';
  }
  public static get visitReasons(): string {
    return this.baseUrl + '/settings/visit-reasons';
  }
  public static get prescriptionprefrence(): string {
    return this.baseUrl + '/settings/prescription-prefrence';
  }
  public static get receiptsettings(): string {
    return this.baseUrl + '/settings/receipt-settings';
  }
  public static get labssettings(): string {
    return this.baseUrl + '/settings/labs-settings';
  }
  public static get datamanagementsettings(): string {
    return this.baseUrl + '/settings/data-management-settings';
  }
  public static get vitalssettings(): string {
    return this.baseUrl + '/patient-data/vitals';
  }
  public static get demographic(): string {
    return this.baseUrl + '/patient-data/demographic';
  }
  public static get problems(): string {
    return this.baseUrl + '/patient-data/problems';
  }
  public static get allergies(): string {
    return this.baseUrl + '/patient-data/allergies';
  }
  public static get demographicEdit(): string {
    return this.baseUrl + '/settings/demographic/edit';
  }
  public static get pmhEdit(): string {
    return this.baseUrl + '/patient-data/history/past-Medical-History';
  }
  public static get pshEdit(): string {
    return this.baseUrl + '/patient-data/history/past-Surgical-History';
  }
  public static get fhEdit(): string {
    return this.baseUrl + '/patient-data/history/family-History';
  }
  public static get shEdit(): string {
    return this.baseUrl + '/patient-data/history/social-History';
  }
  public static get hpEdit(): string {
    return this.baseUrl + '/patient-data/hospitalizations-Procedures';
  }
  public static get ltcfEdit(): string {
    return this.baseUrl + '/patient-data/history/long-Term-Care-Facility';
  }
  public static get hEdit(): string {
    return this.baseUrl + '/patient-data/history/Hospice';
  }
  public static get idEdit(): string {
    return this.baseUrl + '/patient-data/history/implantable-Devices';
  }
  public static get documents(): string {
    return this.baseUrl + '/patient-data/documents';
  }
  public static get carechecklists(): string {
    return this.baseUrl + '/patient-data/carechecklists';
  }
  public static get flowsheets(): string {
    return this.baseUrl + '/patient-data/flowsheets';
  }
  public static get immunizations(): string {
    return this.baseUrl + '/patient-data/immunizations';
  }
  public static get addImmunization(): string {
    return this.baseUrl + '/patient-data/immunizations/add-immunization';
  }
  public static get account(): string {
    return this.baseUrl + '/patient-data/account';
  }
  public static get customers(): string {
    return this.baseUrl + '/customers';
  }
  public static get AddCustomers(): string {
    return this.baseUrl + '/customers/add-customers';
  }
  public static get EditCustomers(): string {
    return this.baseUrl + '/customers/edit-customers';
  }
  public static get ViewCustomers(): string {
    return this.baseUrl + '/customers/view-customers';
  }
  public static get taxVendors(): string {
    return this.baseUrl + '/tax-vendors';
  }
  public static get addTaxVendors(): string {
    return this.baseUrl + '/tax-vendors/add-tax-vendor';
  }
  public static get editTaxVendors(): string {
    return this.baseUrl + '/tax-vendors/edit-tax-vendor';
  }
  public static get viewTaxVendor(): string {
    return this.baseUrl + '/tax-vendors/view-tax-vendor';
  }
  public static get suppliers(): string {
    return this.baseUrl + '/suppliers';
  }
  public static get AddSuppliers(): string {
    return this.baseUrl + '/suppliers/add-suppliers';
  }
  public static get EditSuppliers(): string {
    return this.baseUrl + '/suppliers/edit-suppliers';
  }
  public static get ViewSuppliers(): string {
    return this.baseUrl + '/suppliers/view-suppliers';
  }
  public static get blockProcessor(): string {
    return this.baseUrl + '/block-processor';
  }
  public static get AddBlockProcessor(): string {
    return this.baseUrl + '/block-processor/add-block-processor';
  }
  public static get EditBlockProcessor(): string {
    return this.baseUrl + '/block-processor/edit-block-processor';
  }
  public static get Sales(): string {
    return this.baseUrl + '/sales';
  }
  public static get addSales(): string {
    return this.baseUrl + '/sales/add-sales';
  }
  public static get editSales(): string {
    return this.baseUrl + '/sales/edit-sales';
  }
  public static get paidSales(): string {
    return this.baseUrl + '/sales/paid-sales';
  }
  public static get unpaidSales(): string {
    return this.baseUrl + '/sales/unpaid-sales';
  }
  public static get categories(): string {
    return this.baseUrl + '/settings/categories';
  }
  public static get subCategories(): string {
    return this.baseUrl + '/settings/subCategories';
  }
  public static get staffDesignation(): string {
    return this.baseUrl + '/staffDesignation';
  }
  public static get taxes(): string {
    return this.baseUrl + '/settings/taxes';
  }
  public static get expensesReport(): string {
    return this.baseUrl + '/reports/expenses-reports';
  }
  public static get inventoryReport(): string {
    return this.baseUrl + '/reports/inventory-reports';
  }
  public static get salesReport(): string {
    return this.baseUrl + '/reports/sales-reports';
  }  
  public static get salesCreditReport(): string {
    return this.baseUrl + '/reports/sales-credit-report';
  }  
  public static get salesTaxReport(): string {
    return this.baseUrl + '/reports/sales-tax-report';
  }  
  public static get purchaseReport(): string {
    return this.baseUrl + '/reports/purchase-reports';
  }  
  public static get paymentInReport(): string {
    return this.baseUrl + '/reports/payment-in-reports';
  }  
  public static get paymentOutReports(): string {
    return this.baseUrl + '/reports/payment-out-reports';
  }  
  public static get profitLossReports(): string {
    return this.baseUrl + '/reports/profit-loss-reports';
  }  
  public static get taxVendorsReports(): string {
    return this.baseUrl + '/reports/tax-vendors-reports';
  }  
  public static get purchase(): string {
    return this.baseUrl + '/purchase';
  }
  public static get addPurchase(): string {
    return this.baseUrl + '/purchase/add-purchase';
  }
  public static get editPurchase(): string {
    return this.baseUrl + '/purchase/edit-purchase';
  }
  public static get paidPurchase(): string {
    return this.baseUrl + '/purchase/paid-purchase';
  }
  public static get unpaidPurchase(): string {
    return this.baseUrl + '/purchase/unpaid-purchases';
  }
  public static get purchaseReturn(): string {
    return this.baseUrl + '/purchase-return';
  }


  
  public static get addPurchaseReturn(): string {
    return this.baseUrl + '/purchase-return/add-purchase-return';
  }
  public static get editPurchaseReturn(): string {
    return this.baseUrl + '/purchase-return/edit-purchase-return/:id';
  }
  public static get paidPurchaseReturn(): string {
    return this.baseUrl + '/purchase-return/paid-purchase-return';
  }
  public static get unpaidPurchaseReturn(): string {
    return this.baseUrl + '//purchase-return/unpaid-purchases-return';
  }


  public static get salesReturn(): string {
    return this.baseUrl + '/sales-return';
  }
  public static get addSalesReturn(): string {
    return this.baseUrl + '/sales-return/add-sales-return';
  }
  public static get editSalesReturn(): string {
    return this.baseUrl + '/sales-return/edit-sales-return';
  }

  public static get paymentIn(): string {
    return this.baseUrl + '/payment-in'
  }
  public static get addPaymentIn(): string {
    return this.baseUrl + '/payment-in/add-payment-in'
  }
  public static get paymentOut(): string {
    return this.baseUrl + '/payment-out'
  }
  public static get addPaymentOut(): string {
    return this.baseUrl + '/payment-out/add-payment-out'
  }
  public static get unitsList(): string {
    return this.baseUrl + '/settings/units';
  }
  public static get expenses(): string {
    return this.baseUrl + '/expenses';
  }
  public static get addExpenses(): string {
    return this.baseUrl + '/expenses/add-expenses';
  }
  public static get editExpenses(): string {
    return this.baseUrl + '/expenses/edit-expenses';
  }
  public static get viewExpenses(): string {
    return this.baseUrl + '/expenses/view-expenses';
  }
  public static get expenseCategories(): string {
    return this.baseUrl + '/expenseCategories';
  }
  public static get editExpensesCategories(): string {
    return this.baseUrl + '/expenseCategories/edit-expensesCategories';
  }
  // public static get viewExpenses(): string {
  //   return this.baseUrl + '/expenses/view-expenses';
  // }
  public static get blocksList(): string {
    return this.baseUrl + '/blocks-processing';
  }
  public static get addBlocks(): string {
    return this.baseUrl + '/blocks-processing/add-blocks';
  }
  public static get editBlocks(): string {
    return this.baseUrl + '/blocks-processing/edit-blocks';
  }
  public static get blocksCustomerList(): string {
    return this.baseUrl + '/block-customer';
  }
  public static get addBlocksCustomer(): string {
    return this.baseUrl + '/block-customer/add-block-customer';
  }
  public static get editBlocksCustomer(): string {
    return this.baseUrl + '/block-customer/edit-block-customer';
  }
  public static get payrollList(): string {
    return this.baseUrl + '/payroll/payrollList';
  }
  
  public static get slabs(): string {
    return this.baseUrl + '/slabs';
  }
  
  public static get lot(): string {
    return this.baseUrl + '/lot';
  }
  public static get stockAdjustment(): string {
    return this.baseUrl + '/stock-adjustment';
  }
  public static get stockTransfer(): string {
    return this.baseUrl + '/stock-transfer';
  }
  public static get blocks(): string {
    return this.baseUrl + '/blocks';
  }
  public static get addNewPurchase(): string{
    return this.baseUrl + '/new-purchase/add-new-purchase';
  }
  public static get editNewPurchase(): string{
    return this.baseUrl + '/new-purchase/edit-new-purchase/:id';
  }
  public static get listNewPurchase(): string{
    return this.baseUrl + '/new-purchase';
  }

  public static get quotations(): string {
    return this.baseUrl + '/quotations';
  }
  public static get addQuotations(): string {
    return this.baseUrl + '/quotations/add-quotations';
  }
  public static get editQuotations(): string {
    return this.baseUrl + '/quotations/edit-quotations';
  }
  public static get billingAddress(): string {
    return this.baseUrl + '/settings/billing-Address';
  }
  public static get addbillingAddress(): string {
    return this.baseUrl + '/settings/billing-Address/add-billing-Address';
  }
  public static get editbillingAddress(): string {
    return this.baseUrl + '/settings/billing-Address/edit-billing-Address';
  }

  public static get bankAccounts(): string {
    return this.baseUrl + '/settings/bank-accounts';
  }

  public static get generalParties(): string {
    return this.baseUrl + '/general-parties';
  }

  public static get addGeneralParties(): string {
    return this.baseUrl + '/general-parties/add-general-parties';
  }

  public static get editGeneralParties(): string {
    return this.baseUrl + '/general-parties/edit-general-parties';
  }

  public static get viewGeneralParties(): string {
    return this.baseUrl + '/general-parties/view-general-parties';
  }
}
