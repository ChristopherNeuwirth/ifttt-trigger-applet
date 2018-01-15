# Changelog
All notable changes to this project will be documented in this file.

<!---
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).
--->

## [1.0.0] - 2018-01-15
### Added
- ✨ added debug console log function
- ✨ added debug mode
- ✨ added debug log messages regarding time
- ✨ created logger methods in core lib
- ✨📝 created primitive server-side job handling
- 🔧 Passed process.env variables to child process
- 🔧 Added fixed ENV to child_process fork
- ✨ Added micro wrapper to app by using child_process fork
- 🚀 added now deployment information
- 📦 added micro and micro-dev dependencies
- ✨ Added sleeping mode for log messages
- 🔧 Added debuggin functions
- ✏️ Aligned log messages
- 🔧 restructured secret information to env file
- ➕ 🚚 Added now.json for deployment

### Changes
- 🐛 fixed major timing issues
- 🚚 moved now function to core lib
- 💥 removed deprecated now function
- 💥 removed process exit on error
- 🐛 fixed bug that caused now returning string which caused range.contains(now()) to fail.
- 🐛 resolved problems which caused now() not delivering current time in utc +1
- 📝 Updated Readme with Now Deployment Stuff
- 📝 added toDo for summer time
- 🔧 updated package json scripts
- ✏️ Renamed coreLib to core
- 🚚 served now function by core lib
- 💥 Removed deprecated terminate function
- 🐛 fixed bug that caused try catch not to handle error
- 🐛 minor bug fix to setUrl Method
- 🎉 Cron Job Base implementation 
- ➕ Added MomentJs and range plugin 
- ➕ Added node-schedule (cronjob)




<!--- Template for changes:
## [0.0.0] - YYYY-MM-DD
### Added
- Things you've added go here

### Changes
- Things you've changed go here
--->
