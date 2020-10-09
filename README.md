# NOTE: upjs is still in development and is not ready to use


<p align="center">
  <a href="https://github.com/gilnicki/upjs/">
    <img
      alt="Node.js"
      src="https://github.com//gilnicki/upjs/blob/develop/res/logo.svg?raw=true"
      width="400"
    />
  </a>
</p>

# Updater App

**upjs** is a simple app for downloading updates for your program. It's based on NodeJs but when built to a native executable, can be used on any operating system with no dependecies.

## Usage
To run the app simply run the upjs.exe with an appriopriate commad. 

### Check for update
>upjs github-check --user **[GITHUB USERNAME]** --repo **[GITHUB REPO NAME]** --current **[VERSION]** 

sample:
> upjs github-check --user **gilnicki** --repo **upjs** --current **0.0.1** 

### Get the update
>upjs github-get -u **[GIHUB USERNAME]** -r **[GITHUB REPO NAME]**

### Get the update
>upjs github-get -u **[GIHUB USERNAME]** -r **[GITHUB REPO NAME]**


Those are only the sample commands but you can get the full list of available commands with:
>upjs --help

## Build
1. Clone this repo
2. Run `npm install`
3. Install ***[nexe](https://github.com/nexe/nexe/)*** with `npm install nexe -g`
4. Run `nexe -t windows-x64-12.16.3`
---

With ❤ and ☕ Greg

---
This program is open-source and distributed under the GNU General Public License, see *LICENSE.md* for details.


