# Energy Factory BB55 Milestone 2
## Eneryg monitor Dashboard
By Yvett Smith

This Dashboard will be used mainly by a owner of solar pannels. To have an overwiew of the monthly, daily enery that was produced by the solor pannels. 

The user will also be able to do inspection on usaged and production and will have and idea what is the impact of the sunpower forcast on the production.


Click [here](https://lemoenskil.github.io/Milestone2-_BBS5_Factory_dashbord/) to see the website.

## UX
This Dashboard if for a home solar panel owner.  The owner will use this dashbord to get an overview of the production on the historical data   



### Strategy plane

#### Create a website for a Engineering Consulting Company bSentient
    
Build  Interactive Dashboard for a Home solar panel installation. 

The Dashboard has the following requirements:
    • Their primary target audiences are owners or prospective owners of Solar Home Installation
    • The Dashboard need to include the following 
	-installation address and location.
	-installation summery
	-Totals for carbon avoided and Euro earned
	-Graphs that show the daily and monthly and yearly production in kWh.
	-Graph that show the monthly usage compare to production
	-Heat map showing sun power weather data for on the Netherlands
	-Line Graph showing the sun power over the location of the solar installation.
	-Scatterplot showing the correlation between sun energy and power production
	
    • I need the following for the dashboard
	-photo of the installation
	-Summery of the installation
	-data file of kWh produced
	-Data of consumed energy
	-information on tariff and carbon avoided
	-Weather data (knmi)
    • Need a selector to choose the year and one to choose between euro and kWh
    • A map is also need to show the installation location

#### User stories:
Stories:
•	As a user, I'd like to see clean, well presented data in easy to understand/read format (graphs, charts, etc…)
•	As a user, I'd like to see a variety of charts/graphs to show different data in the dataset
•	As a user, I’d like for the dashboard to be made so that it will work and adapt to all manner of devices (responsive design)
•	As a user, I'd like to see some text to explain the data/statistics being seen on screen, giving further knowledge/context to the data being displayed
•	As a user, I'd like to see engaging use of colour making the dashboard pleasant to look at and keeping the user interested
•	As a user, I'd like to see easy to read font format for both the title/heading and all other writing on the dashboard
•	As a user, I'd like to be able to see the difference between kWh, Euro’s
•	As a user, I’d like to be able to have an overview of day, month and year data
•	As a user I’d like to be to compare data from the weather with my solor production
•	As a user, I'd like to be able to reset all the filters placed through clicks on the graphs with a simple button (therefore reverting the data shown on the graphs back to the default data)

#### Putting it all in the strategy plane

Project Purpose
I am creating a Data dashboard aimed towards helping current and prospective home solar panel installation owner getting an overview of their production, yield, carbon avoided  and cost.
The data dashboard will use both D3, leaflet and DC to plot multiple charts that will focus on different aspects of the dataset that I am using. The information I will mainly focus on is the energy/power production per day month and year.  I will only include the data from the date of installation from 19 September.   The usage date will be from Jan 2019.   
The dashboard will also include google map api. Whith the date from the weat 'knmi Dutch weathe' a  correlation map between the energy and sun power will be ploted
Why would a user want this?
In the current state of global warming solar power is a hot topic.  The user will not only want to save the planet but also want to see what is in it for him, and that will be financially.   Also as a user is would be nice to have a look as historical weather data do see what the correlation is between the weather and the production will be.
The user will also want it to get a one page overview in of his current production vs usage this can help in decisions for example extending the capacity of using the current capacity better.  (example if you want to move from the gas supply to only electrical)
Why is this so special?
The Data dashboard will stand out as it will have graphs that are easy to read and comprehend, and these will present the dataset in a way that provides the user with all of the required information,.
User Experience
There will be clean, well presented data in easy to understand/read format (graphs, charts, etc…), this will be the main draw to the dashboard.
The dashboard will also have responsive design, so it can display correctly on mobile devices, right through to large desktops, therefore allowing the information to be accessed and viewed properly no matter where you are or what device you are using.
There will also be summaries with some text included on the page to explain the data/statistics being seen on screen, giving further knowledge/context to the data being displayed.

    
### Scope Plane
    What they say they need
    • A Dashboard.
    • View their historical data
    • See profit made
    • Show that they are contrubuting to geener future

    What they actually need
    • Response Dashboard.
    • That can be viewed on a mobile.
    • Gives totals on montly, yearly and daily 
    

### Structure Plane

Information Architecture
Will be a simple tree structure using a horizontal bar near the top of the page taking up the right        two thirds of the page.
Interaction Design (IXD)
    • The Navbar will have the name of the istalation and a logo
    • For the color schem a bootwatch slate will be used.
    • One page sectins  will be used with a grid to it.
    • There will be a footer at the end that redirect you back to the top
    
### Skeleton Plane

#### mock-ups:

In the links below you can see the mock-up’s that I drew using the mock-up tool “Balsamiq”:
![Desk top mockup](/assets/mobile_wireframe.JPG)
![Mobile mockup](assets/desktop_wireframe.JPG)
- 
**Note that the final design has changed from the original design in the mock-ups. The reason why it has changed.  I was trying different layouts while I was experimenting and learning the code and sometimes the new designs looked better than the original ones, or was just more responsive. *
#### Design Ideas
The layout and the design of the dashboard, will be devided into blocks to give a  professional and of a high standard look. I broke the design down into various style decisions:

##### Font
I will be using “Roboto” that comes with the bootwatch template.

##### Colour Scheme
I am using the “Sandstone” theme from Bootswatch

## Features

### Existing Features
#### Feature 1 - Navbar
the navbar has the logo and name with a floating reset button

#### Feature 2 - Location map
The google api to show the solar panels on the map with a solar pannel icon.

#### Feature 3 - Summery of Euro and carbon on monitory graphs
The total euro and total carbon as with the selected graph.

#### Feature 4 - Jumbotron
Jumbotron that give a outline of the Dashboard

#### Feature 5 - Solorpanel production navbar with dropdowns
The navbar for the solar production graphs has 2 dropdowns 
-One where the user can choose a year  but intial year will be 2019.  
-A drop down to check the euro value or kwh value for the 4 graphs.

#### Feature 6 - Solor panel monitor graphs
-3 Bar charts for yearly, monthy and daily data.  Each of them with a reset that is hidden with nothing is selected.
-Line chart to show the hourly production with reset  the is hidden when nothing is selected.  The graph also have a brush on to for selection a certain range.

#### Feature 7 - Usage vs production graphs
-Bar chart with a selector to choose year.  the chart also has a reset function
-Composite chart with a bar and a line chart to show the prododuction vs the usaga.  The chart is also fitted with a brush selector and reset function.

#### Feature 8 - Scatter plot
The scatter plot i have combine date and plotted it kWH, Radiation and Day.

#### Feature 9 - Heat Map
-Used leafet to create a map with Radiation date per weather station in the Netherland.
-The map have a time dimension control player that is the standard one for leaflet.
--need to check how to reset the map as when you use the player the interactive charts do not work

#### Feature 10 - Sunpower charts
-2 Bar charts that are interactive on the heatmap on selected dates
-Weather station selector where the weather station of choice can be selected.
-As I have the problem that I do not know how to reset the heatmap yet i have put a reset button for the map to use with the interactive charts.

#### Feature 11 - Footer
The footer has some reference and a reset button with a hover function

#### Feature 12 - Data update script
A phython scrip to combine the daily production files into one file

### Features Left to Implement
#### Feature 1 - Customizing the play functionality on the heatmap  
-To add a function to reset play and work with interactive maps 
#### Feature 2 – Try to get live date in for solor pannel production
-At the moment i have to download my data, I would like te see my current solar production.
#### Feature 3 – Forecasted sun radiation
-Will be nice to have the 14 day forcasted radiation to determine expected yield


## Technologies Used

- AWS cloud9
- Balsamiq
- HTML5
- CSS3
- Bootstrap
- notepad++
- leafet
- Font awesome
- GIT
- GITHUB
- Google Chrome developer tools
- Cloud 9 IDE
- Javascript
- JQuery
- Python
- DC, D3 and crossfilter
- Google map api

## Testing

### Validation

- Used https://validator.w3.org/ in order to validate the HTML code.
- Used https://jigsaw.w3.org/css-validator/ in order to validate the CSS code.
--JSHINT

### Features and responsiveness testing
- Navbar
The navbar was test on responsiveness and the reset button was changed to a floating one to make it easier to reset

- Location map and picture
for mobile I have removed the picture for mobile as was not scaling well and was crowded


- Summery of Euro and carbon on monitory graphs
The total euro and total carbon has been hidden for mobile with media as with the tesing i saw there was no overview on small screens

- Jumbotron
Jumbotron the font was adjusted and a mediaQuerie was added to for easy read on smaller schreens

- Solorpanel production navbar with dropdowns
The navbar for the solar production graphs has been test and the sizing has been change to fit better on the small mobile
-intial year will be 2019. that work and also selecting 2018 works but when you have selected on the graph you can not use this filter before resetting it  
-Euro value or kwh value for the 4 graphs. Was tested and work and the y axis label change to Euro.

- Solor panel monitor graphs
-Testing on small mobile i had to add the scroll bar, which was not needed for the rest
-Tested the 3 Bar charts for yearly, monthy and daily data.  The reset buttons where functional and and separete cliking on the bars worked.
-Line chart that show the hourly production with reset and brush worked.

- Usage vs production graphs
-Bar chart with a selector to choose year, and the reset function has been tested
-and the selection has been tested that only that the group empty of when selection a new bar.
-A scroll bar was added for responsiveness

- Scatter plot
Added a scroll bar for responsiveness, and changed the colors to fit while testing

- Heat Map
-Used leafet to create a map with Radiation date per weather station in the Netherland.
-The map have a time dimension control player that is the standard one for leaflet.
--need to check how to reset the map as when you use the player the interactive charts do not work

- Sunpower charts
-2 Bar charts that are interactive on the heatmap on selected dates
-Weather station selector where the weather station of choice can be selected.

- Footer
Need to update the footer maybe with a link or to or reset button

- Data update script
A phython scrip to combine the daily production files into one file

See attached sheet made for testing the responsiveness for mobile to desktop



### Additional testing
Used development tools in Google Chrome to check how the website would look in different devices. Also used it to try different style and ideas.   
Also did intensive testing on links.    Also checked the form on the contact page if the required field did their job

### Problems and bugs:
- Had bugs and problems with padding and margin where it went to creative and had overflow on the sides.  
Also had buggs where my div did not align up properly   I also had to call in the help of a tutor which help me
- to use the! Important function to overwrite bootstrap settings..


## Deployment
This site is coded in Cloud9 IDE, a local Git directory was used for version control. It is hosted by using GitHub, deployed directly from the master branch. The deployed site will update automatically upon new commits to the master branch. In order for the site to deploy correctly on GitHub pages, the landing page must be named index.html.  I have ran regular commits after every important update to the code, and I pushed the changes to GitHub pages.
Once in a GITHUB repositories it was made live using GITHUB Pages. The website can be found at: https://github.com/Lemoenskil/milestoneoneproject/

## Credits

### Content
Took content on training.html form webpage https://objectcomputing.com/services/software-engineering/resources/5-reasons-to-transition-to-open-source.   And the content of product.html form the website https://staraid.ai/

### Media
Video used are on YouTube and website https://staraid.ai/
- 
### Photos used:
Pictures used for background
Credit information for each image in this collection is listed below. Simply match the image ID numbers below to the ID number in the image file name to credit the proper image.
More about usage rights can be found here:
https://www.dreamstime.com/terms#using

- Image ID: 140964942
    Copyright Siarhei Yurchanka | Dreamstime.com
    https://www.dreamstime.com/yur4you_info
    
- Image ID: 134781260
    Copyright Siarhei Yurchanka | Dreamstime.com
    https://www.dreamstime.com/yur4you_info
    
- Image ID: 111718113
    Copyright Vs1489 | Dreamstime.com
    https://www.dreamstime.com/vs1489_info

- Image ID: 96999098
    Copyright Allexxandar | Dreamstime.com
    https://www.dreamstime.com/allexxandar_info

### Data sets
-Sunny portal -production data
-GreenChoice - energy provider montly usage
-KNMI -weather data (sun radiation)

### Work based on other code
the desktop navbar was re-used from the mini-project,
the jumbotron was used for the whiskey drop-project

### Acknowledgements
Thanks to my husband for playing the customer
Also, family and friend giving feedback on the UX
Also, thanks to my mentor Spencer helping my put some order in chaos and thanks to the tutors helping me with the hamburger menu and background pictures
