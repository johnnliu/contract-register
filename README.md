# contract-register
Contract Register sample for SharePoint Online.

* SharePoint Online or SharePoint On-Premises
* AngularJS
* Telerik Kendo UI
* PnP SP Core
* Webpack
* Gulp 

## Video intro (20 seconds) 

[![Contract Register YouTube](http://img.youtube.com/vi/rP8d_0MdedY/0.jpg)](http://www.youtube.com/watch?v=rP8d_0MdedY)

## Getting Started - How to run the Contract-Register demo

* You will need to have Node installed https://nodejs.org/

* Fork from https://github.com/johnnliu/contract-register or download as Zip

* In Node command-line, go to the contract-register directory and run

  > npm install
  
  > This installs all the defined packages within the package json file
  
* Run gulp tasks

  > gulp build 

  > This will build the project

* Deploy to your SharePoint

  > Copy user.sample.js to user js with your account details and site url

  > gulp deploy

  > This will build and deploy the JavaScript to your SharePoint site's SiteAssets document library

* One-off

  > Create a page with a Content Editor webpart, and point it to the SiteAssets/SPApp.html file




## Setup user.sample.js, copy and paste then and change to user.js 

```javascript 

module.exports = { 
    username: "", 
    password: "", 
    site: "" 
}; 
