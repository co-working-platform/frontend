# Noe Workspace - Co-Working Platform - Frontend

This project features a real-time application dedicated to the use of 'Boulangerie Noe' company.
 
## Features (Requirements)
- Application implemented with VUE CLI v2
- It makes use of the NODE.js and NUXT.js frameworks
- The frontend is divided into pages and components, as well as contains the main layout component
- There exists data access levels implemented on the backend and received through the API calls  
- Authentication is supported by Nuxt Auth module
- Http requests are made using the promise-based HTTP client module Axios.

## Structure
- [`co-working-platform-frontend`] (#co-working-platform-frontend)
  - [`nuxt`] (#nuxt)
  - [`components`] (#components)
  - [`layouts`] (#layouts)
  - [`middleware`] (#middleware)
  - [`plugins`] (#plugins)
  - [`utils`] (#utils) 
  
## `co-working-platform-frontend`
The source folder containing all the necessary files and folders of the frontend.

### `nuxt` 
In this folder the automatic files of the nuxt configurations are added.
In nuxt.config file we added all our authentication, as well as all the plugins we used for different feature implementation, such as the exporting to csv, the pincode configuration for the frontend.
The authentication in the nuxt.config file is created as follows: 
- there are strategies created
- our strategy is called 'local'
- this 'local' strategy contains all information needed to send a POST request to get the user authenticated with the inserted credentials
- another method this strategy contains is when logging out the authenticated user, it automatically redirects the user and erases it
- the last method it presents is the GET method for the authenticated user, returning the currently logged in user.
In this configuration file we also added the information rrequired for the axios base requests, setting the base endpoint to 'http://localhost:8765' and asking for credentials when creating the requests.

### `components`
This is a shared components folder.

##### `admin-components`
It contains the components related to the CRUD operations for each entity, allowed to be done by an admin or a CEO.

##### `employee-page-components`
All the features associated with the employees, including the CRUD operations, listing and folder assignment, can be found in this folder.

##### `file-page-components`
This folder incorporates the components used to upload files and list the departments, depending on the user's role.

##### `folder-components`
Folders and files filtered on departments, base-folders and city are found in this component.

##### `planning-components`
It contains all the components needed for the planning feature of the app, being found three different components, depending on the user's access.

##### `product-page-components`
In this folder can be found all the features associated with the products, including the CRUD operations and listing of products and recipes.

##### `user-page-components`
The user profile, including the operations related to a user's account, can be found in this folder composed of different components, divided on allowed operations.

### `layouts`
The layouts' folder includes the default vue component which contains the main template of all pages. It contains the sidebar with all the buttons for redirecting to the desired page. This layout appears on every single page of the application as a frame which also has the login and logout button in the header, as well as the city selection, which saves the city name in the local storage for further usage. 
Another file located in this folder is the error component which redirects to an error page whenever there is an issue with the frontend requests or methods.
 
### `plugins`
An interceptor for axios is implemented in this folder and it handles the 401 status by checking the response of each HTTP request.

### `utils`
This folder contains a javascript file with all the validations different fields of the forms are using.
Some validations include checking if the entered input is an accurate phone number, or if the text entered is a valid email address.
This kind of validations inform the user about the type of information he is required to enter to match the backend, as well as they do not let the user continue with the form submission before entering valid fields in the respective text boxes or input boxes.

## Axios
Http requests are implemented using the Axios module and the authorization token.
Nuxt auth module is used to set the Bearer token and the refresh token.
In order to use these modules, the nuxt.config.js should be update using in the modules list :
'@nuxtjs/axios'
'@nuxtjs/auth'

## Helpers

### Icons
The icons used in the application are picked from the large panel of icons provided by the material design icons found at https://materialdesignicons.com/
Vuetify allows the use of the former panel of icons by specifying the 'mdi-' prefix followed by a valid suffix to an icon component.

### .env.js
In order to switch from development/maintenance to production mode, the axios base url is automatically modified. This is done by creating a .env file for development by specifying the base url as http://localhost:8765 and a .env.production file to define the base url when the app is deployed to the cloud server's IP address http://212.227.210.204:8765
Nuxt.js decides which base url to use depending on the type of rendering made. The command 'npm run dev' uses the local host url and 'npm run generate' and 'npm run start' uses the cloud server's url. In this way, nuxt.js is responsible for choosing the environment to render such that developers do not have to modify the url parameters manually every time themselves.

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).


## Deployment 
The frontend application is deployed using Ionos 1&1 webspace service. The command 'npm run generate' creates a static target render by converting the nuxt.js components to lower level components (html and Javascript). These files are created in the dist folder of the project. Every file is copied to a 1&1 webspace and assigned to the domain name 'noeworkspace.com'.
