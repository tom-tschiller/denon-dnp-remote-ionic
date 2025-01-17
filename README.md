! App in development !
 
App uses clear-text traffic, must be defined in AndroidManifest.xml

App uses Capacitor Http API (https://capacitorjs.com/docs/apis/http) due to CORS restrictions. Overrides default fetch API calls

TODO:
* Swipe to scroll up and down
* Bugfix page up and down (index)
* HTML encoded chars
* Long folder names (line breaks)
* Layout (first and last line in selection), probably all lines with ChFlag 1 are selectable. Check mode "now playing"
* Auto update list, periodically, on app open, etc.
* Check if device is powered or on standby
* Refactor IP configuration and store as preferences: https://capacitorjs.com/docs/apis/preferences
* Network check for Wifi: https://capacitorjs.com/docs/apis/network
