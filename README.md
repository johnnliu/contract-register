# contract-register
Contract Register sample for SharePoint Online and SharePoint On-Premises

This is a learning, research project based on simplified client requirements, we built this project over two weeks while writing [Preparing Your Toolbox for the SharePoint Framework with Angular, Webpack and Kendo UI](http://www.telerik.com/campaigns/kendo-ui/sharepoint-framework-ui-customization-angular) (whitepaper)

* SharePoint Online or SharePoint On-Premises
* [Angular 1.5](https://docs.angularjs.org/guide/introduction)
* [Telerik Kendo UI](http://www.telerik.com/kendo-ui/ui-for-office-365-sharepoint)
* [PnP SP Core - Patterns and Practices JavaScript Core Library](https://github.com/OfficeDev/PnP-JS-Core/)
* [Webpack](http://webpack.github.io/docs/what-is-webpack.html)
* [Gulp ](http://gulpjs.com/)

## Video intro (20 seconds) 

[![Contract Register YouTube](http://img.youtube.com/vi/rP8d_0MdedY/0.jpg)](http://www.youtube.com/watch?v=rP8d_0MdedY)

## Features of this app

 * Batch list initialization
 * Grid binding to list
 * Window as modal popup
 * Validation controls
 * PDF Export from list item
 * Upload attachments to list item via REST
 * WebPack bundled modules - loads extremely fast (<1 second)
 * Target: SPO, SP2013, SP2016
 * Future: SharePoint Framework SPFx

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
