# Npm package sizes
npm-package-size project aims at bundling and computing the minified and gzipped sizes of a given npm package.
The project consists of 3 yarn workspaces: 
+ npm-pkg-utils: a library to build packages and compute their sizes (based on npm, yarn, webpack and zlib)
+ frontend: a user interface to request those package information  
+ server: a server to process the frontend request and build the package with the library

![npm-package-size frontend](screenshot.png?raw=true)
## Installation and launch
The project has been tested with the following environment:
+ Windows 10
+ node: v12.16.2
+ npm: v6.14.4
+ yarn: 1.12.3
Create a new folder and clone your repository inside. Due to a limitation of yarn workspace, the temporary packages 
need to be installed outside the workspace. This step is needed if you don't want to have a tmp folder popping in your 
git_clones folder. 
Install node, npm and yarn. As the project consists of yarn workspaces, the dependencies should be installed with yarn:
```bash
yarn install
```
In the root folder, run
```bash
yarn start
```
Your server should now be up and running on http://localhost:3000
In case you want to debug and watch your changes, you can run:
```bash
yarn watch
```
NOTE: sometimes the watcher fails to see that after npm-pkg-utils is updated, server should be updated. In this case,
 you will need to rerun the watcher.
 ## Build and packaging
 The server workspace depends on npm-pkg-utils and has to serve the static files from the frontend. As such the build
  needs to be processed in a specific order:
  1. npm-pkg-utils: builds in its dist which is referenced from the node_modules thanks to the workspace mechanism
  2. frontend: builds in server/dist/public so that server can easily serve the static files
  3. server: builds in server/dist with the ref to npm-pkg-utils and will serve the static from server/dist/public
In the end, the deliverable is what's inside server/dist/
## Application workflow
+ A textfield is provided to the user so he can input the package for which he wants to get the minified and gzipped 
sizes. 
+ When he presses enter or click on the search button, a search is triggered. 
+ The application then enters a loading state during which the search feature is disabled until the request 
has been processed by the server. In the meantime, the server makes one request to node registry to get all the 
versions of the requested package. It takes the 3 last (non pre-release) as well as the last version of the previous 
major. Then it launches up to 4 async methods to build and get the package sizes information.
+ When the response comes back, if there was an error or no data, the application enters an error state and the search 
is re-enabled. Else a histogram comparing the sizes of the different versions is displayed. On hover, the user can see 
the sizes of the minified and gzipped bundles.
+ If the build only failed for some package versions but not all, the histogram is still displayed but a warning 
listing the failed versions is displayed (E.g. bundlephobia has a 0.0.1 that is not compatible but 0.1.0 is fine)
## Architecture and functional split
### npm-pkg-utils
This library does all the heavy lifting. 
+ given a package name it calls the registry to get the published version. Then retrieve the 3 latest and the last 
version of the previous major. [ajax call]
+ it installs the dependencies in a temporary folder. (yarn add ${packageName}) [I/O]
+ creates an index.js file requiring the package (this will be the entry file for the webpack bundle)
+ look into the package.json of the package to spot all "provided" dependencies, that's to say the peerDependencies
 or the dependencies provided by the environment. (those will be marked as external dependencies and excluded from the 
 webpack bundle) [I/O]
 + create the webpack configuration file (mostly taken from bundlephobia) [in memory]
 + run the webapck build to get the minified bundle [in memory]
 + gzip the bundle [in memory]
 + return the PackageInformation (size, gzip size, package name and package version)  
### backend
The backend is minimalist. It serves the frontend static files and takes package requests that are processed thanks 
to the npm-pkg-utils library. The responses are always json with an http status 200 and can only have 3 formats:
+ custom error containing an error name, an error message and the requested package name
+ list of PackageInformation. 
+ a mix of PackageInformation and custom errors. Those errors carries the package version on top of the fields 
mentioned previously. They occur when a specific package version failed to be built. 
### frontend
The application is quite simple and can be broken down in 4 states:
+ INITIAL: Vanilla state when the page loads. No error, no loading, no package histogram to display
+ LOADING: Whenever a call to the backend is ongoing we enter the loading state. Errors and histogram data are empty. 
The search is disabled.
+ READY: After a request was successful, the histogram is displayed with histogram data. When some package versions 
failed to be built, they are displayed as well.
 +ERROR: After a request failed, a global error is displayed in place of the histogram.
##### react-redux store
react-redux store was used to store the global state of the application that is used across many components or is 
updated on ajax calls:
+ state (INITIAL, LOADING, READY, ERROR)
+ globalError
+ list of PackageInformation

3 actions can update the state:
+ Loading Action: when a request to the backend is launched => clear PackageInformation and globalError, enters the 
LOADING state
+ Set PackageInformation Action: when the request (partially) succeeded => set the new list of PackageInformation, 
enters the READY state
+ Set Error Action: when the request failed to find the package or on internet issue => set the global error, enters 
the ERROR state

The Histogram, error panel and app (to show/hide the loading) are bound to the state changes to display their data. 
The Search panel initiates the state change by triggering the ajax call but also listens to the state change to 
enable/disable its search button.
##### react hooks
React hooks were used for components needing to maintain an internal state (useState) or requiring to do some 
processing on state/property change (useEffects). Mainly it was used for:
+ Search panel: to store the value of the package name text field
+ Loading state: to update its message every 3.5s so that the user feels his request is progressing. 
##### unit tests
Some unit tests were written as well as a few snapshot tests with jest. Unfortunately not all components were tested.

## Limitations
+ The tool fails to build some packages sometimes likely due to node/npm/yarn/webpack versions and maybe sometimes 
because the webpack configuration doesn't cover all the project cases. Sometimes yarn fails to concurrently add 
dependencies.
+ The tool doesn't return the same sizes as bundlephobia (beyond the fact that the project uses 1kB=1000B while 
bundlephobia has 1kiB-1024B, the sizes in bytes differ as well)
+ The backend suffers when a lot of requests are made simultaneously (concurrent access to the disk to install 
package dependencies, as well as bundling in memory.
## Next Steps
+ Ideally use workers as bundlephobia
+ Write e2e tests in selenium for the frontend. Write unit tests for the backend.
+ Have a database to store the results of the package bundles. Populate it with the most common packages 
information so that the server should most of the time fetch the info from the database and only occasionally build 
packages
+ Check why the bundle sizes aren't the same as the ones on bundlephobia
