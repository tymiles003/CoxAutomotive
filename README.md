Welcome to Cox Automotive
=======================
Cox Automotive is a leading provider of products and services that span the automotive ecosystem worldwide. We’ve built the strongest portfolio in the industry with more than 20 brands that together provide end-to-end digital marketing, wholesale and commerce solutions for customers large and small. Our goal is to simplify the trusted exchange of vehicles and maximize value for dealers, manufacturers and car shoppers.  

We built an application that will help customers in making the best decision on their car buying experience.  Powered by IBM Watson, the application will combine the exciting way of car buying process with the simplicity of making decision based on the best selection of cars presented by our application.  

> **NOTE**: The application behaves as regular web application and it is intended to be a prototype for an iPad application.  The setup and layout are to mimic as if the application run on iPad.  

----------

Prerequisites
---------------
1.  Install [NodeJS](https://nodejs.org/)

2.  Install [GIT](http://git-scm.com/).
Project URL: https://hub.jazz.net/git/asetiyadi/as-bm-watson
> $ git clone https://hub.jazz.net/git/asetiyadi/as-bm-watson coxautomotive
3.  Run the application.   
 Navigate to project folder and install the project dependencies with *npm* command.  The main file is server.js
> $ npm install
>
> $ node server

 The application is set to run on port 8000 for the local server.

A Bluemix Application
--------------------------
Cox Automotive web application is run on IBM Bluemix environment.  The official live URL: https://coxautomotive.mybluemix.net

#### Technology Stacks
- Server: NodeJS and Express
- Client: AngularJS, jQuery, Bootstrap
- Bluemix Services:
	- MobileCloud
	- MongoLab
	- Watson Text-to-Speech
	- Watson Speech-to-Text
	- Watson Tradeoff Analytics
 
Besides the regular behavior of typical web application, users have option to use interactive mode.
> **NOTE**: for this prototype, the interactive mode is currently only being supported on desktop version of Chrome and Firefox.  Recommended browser is Chrome. Mobile devices can only run in non-interactive mode.
>
> **TIP**: make sure to test your microphone input setting before using our interactive mode.  To setup your microphone, please visit Sound settings in your computer and test your microphone input level.


#### User Account
For the phase 1 of implementation, the login is currently not wired with backend services.  Users can simply click **LOGIN** to enter the application.  User account creation is not required.

Watson Text-to-Speech | Watson Speech-to-Text
----------------------------------------------------------
![Interactive](https://coxautomotive.mybluemix.net/images/snapshots/CoxAuto_InteractiveIcon.png)

As you enter the application, the default mode is set to interactive.  A personal assistant will explain and guide users on determining the criteria of their cars.   

![Preference Options](https://coxautomotive.mybluemix.net/images/snapshots/CoxAuto_Preference.png)

As users make decision by answering *Yes* or *No* to our guided questions on each of the criteria they want to have, the feedback of their selection is reflected on the screen. 

![Preference Selected](https://coxautomotive.mybluemix.net/images/snapshots/CoxAuto_PreferenceSelected.png)

This interactive feature is made available by the use of **Watson Text-to-Speech** and **Watson Speech-to-Text** services on Bluemix.
> **NOTE**: for best experience, Chrome browser is recommended.

On the next step, users will select which vehicle types they are interested in.  Again, users can make selection using the voice command and the feedback will be reflected immediately on screen.

![Vehicle Types](https://coxautomotive.mybluemix.net/images/snapshots/CoxAuto_VehicleTypes.png)

Some sample of the voice commands that can be used:
> To make selections: 
>
> - *"I want SUV and Minivan"*
> - *"I also want to check on Hybrid"*
> - *"I am interested in Sedan and Hybrid"*
>
> To cancel a selection, use the keyword *Cancel*:
> 
> - *"Cancel Hybrid"*
> - *"Cancel SUV"*
>
> To proceed to the result/report use keyword *Next*

> **NOTE**: for phase 1 we currently only have vehicle data available for SUV, Sedan, Minivan and Hybrid. 


Watson Tradeoff Analytics
-------------------------------
Thanks to IBM Watson, users will no longer need scouring the entire vehicle inventories.  Combine the vehicle criteria with the inventories of vehicle types that were selected, **Watson Tradeoff Analytics** service will receive, analyze and produce the results that will represent the best vehicle options for users.  

For example if users have criteria of *price*, *fuel efficiency*, *performance* and *comfort* with vehicle type of *SUV*, Watson Tradeoff Analytics will show the list of SUV that have the lower price, higher MPG, better performance and better comfort level score.

![Report](https://coxautomotive.mybluemix.net/images/snapshots/CoxAuto_Report.png)

The criteria that were selected previously are displayed at the top of the report

![Report Criteria](https://coxautomotive.mybluemix.net/images/snapshots/CoxAuto_ReportCriteria.png)

Users have the ability to set the minimum and the maximum value of each selected criteria to filter the list of vehicles.  Click on the ![Up Arrow](https://coxautomotive.mybluemix.net/images/snapshots/CoxAuto_Carat.png) to display the sliders and users can adjust the values.  For example:
#####Fuel Efficiency Slider
![Slider](https://coxautomotive.mybluemix.net/images/snapshots/CoxAuto_Slider.png)

In addition to adjusting the value of previously selected criteria, users can remove existing or add new criteria.  When the application detects this request, it will ask Watson Tradeoff Analytics to reevaluate all the inputs and reproduce a new report.

To get the detail info of the vehicle, as well as checking out interior and exterior photos, users can click on any vehicle from the list on the left.  A detail window will show up and users can navigate through all the photos and check out the detail of the vehicle.

![Vehicle Details](https://coxautomotive.mybluemix.net/images/snapshots/CoxAuto_VehicleDetails.png)

