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


Those are only the sample commands but you can get the full list of available commands with:
>upjs --help

## Build
1. Clone this repo
2. Run `npm install`
3. Install ***[pkg](https://github.com/vercel/pkg)*** with `npm install pkg -g`
4. Run `npm run build`
5. *Optional:* if you're on Windows run `npm run win-add-icon` to add an icon to your executable
---

With ❤ and ☕ by Greg

---
This program is open-source and distributed under the MIT License, see *LICENSE.md* for details.


