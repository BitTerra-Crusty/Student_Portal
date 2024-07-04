# Student_Portal

Project Development Overview
Technologies Used
•	Front End: Angular
•	Back End: C# ASP.NET Core API
•	Database: Initially configured with MSSQL (fully functional), then transitioned to MySQL (migration completed but not fully tested)
•	Notifications: Alertify.js for toasts
Initial Configuration
The project was initially configured with MSSQL, as evidenced by the commented code in the appsettings configuration file and the service settings in Program.cs. MySQL was later configured, and migration was successfully run, though the database update has not been tested yet.
Operational Instructions
1.	Running the API:
•	Start the C# API project.
•	Swagger will launch, displaying all API endpoints. You can test these endpoints directly through Swagger or use the Angular front end.
Note: Since MySQL configurations have not been fully tested, it is recommended to:
•	Uncomment the MSSQL connection string in the appsettings file.
•	Comment out the MySQL connection string.
•	Similarly, update the Program.cs file accordingly.
•	Run the commands: add-migration init followed by update-database in the console manager, to prepare the database. This project follows a code-first approach.
Front-End Capabilities
1.	Login Page:
•	The initial page upon running the application.
•	New users must register by clicking the register link.
2.	Registration Page:
•	Users must fill in all required fields, with validations in place.
•	Password requirements: at least 8 characters long, alphanumeric, and including special characters.
•	Successful registration triggers a success notification and redirects to the login page.
3.	Login Process:
•	Users log in with their email and password.
•	A success notification is displayed, and a token valid for 5 minutes is generated. After expiration, users must log in again.
•	Successful login redirects to the dashboard displaying all registered users (note: this is for demonstration purposes and not recommended for real-world scenarios).
•	Only users with a valid token can view the user list.
4.	Forgot Password:
•	A link on the login page allows users to reset their password.
•	Users must enter a valid email address to receive a password reset link.
•	Following the link allows users to set a new password, with appropriate validations.
•	Upon successful password reset, a success notification is displayed, and users are redirected to the login page.
Additional Notes
•	The project has not yet been pushed to GitHub for the sake of time but will be done subsequently.


