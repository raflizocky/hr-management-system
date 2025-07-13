# HRMS – Multi-Tenant HR Management System

A modern, role-based, multi-tenant Human Resource Management System (HRMS) designed for startups, SMBs, and enterprises. Built with **Next.js**, and **shadcn/ui**.

Need a custom HR solution? [Contact Us](mailto:work.raflizocky@gmail.com).

> ⚠️ This project is still under development and hasn't been fully tested yet. Expect bugs, missing features, or setup issues.

<img src="https://github.com/user-attachments/assets/38d98e9c-ed22-4510-bef8-9d7443fb292e" alt="Login" width="100%">

<img src="https://github.com/user-attachments/assets/ad019cbc-7bf4-4694-9e59-f9b6f47f8de9" alt="Admin" width="100%">

<img src="https://github.com/user-attachments/assets/45a7cce2-54f1-484f-b6be-ca72a62f8d48" alt="HR" width="100%">

<img src="https://github.com/user-attachments/assets/f006c0e2-7c74-4218-a0e9-b08987b9a5d9" alt="Employee" width="100%">

## Features

### Employee
- View attendance and performance
- Submit leave requests
- Participate in surveys and feedback
- Manage shift details
- View pending reviews and company announcements

### HR Manager
Includes all Employee features plus:
- Manage employee directory
- Create departments and roles
- Onboard and offboard employees
- Approve/reject leave requests
- Monitor attendance trends
- Generate HR reports
- Configure HR settings

### Admin / Super Admin
Includes all HR features plus:
- Manage user accounts and permissions
- View audit logs and system activities
- Access tenant-wide settings
- Configure AI tools and integrations
- Set up new company tenants
- Manage branding, language, and localization

## Multi-Tenancy Architecture

- **Tenant Isolation:** All company data is scoped per tenant using unique identifiers.
- **Scoped Access:** Users only access data from their organization.
- **Demo Mode:** Role-based demo login for quick testing and previews.
  
## Installation

```shell
npm install
npm run dev
```

## Contributing

If you encounter any issues or would like to contribute to the project, feel free to:

-   Report any [issues](https://github.com/raflizocky/hr-management-system/issues).
-   Submit a [pull request](https://github.com/raflizocky/hr-management-system/pulls).
-   Participate in [discussions](https://github.com/raflizocky/hr-management-system/discussions) for any questions, feedback, or suggestions.

## License

Code released under the [MIT License](https://github.com/raflizocky/hr-management-system/blob/main/LICENSE). Attribution appreciated.
