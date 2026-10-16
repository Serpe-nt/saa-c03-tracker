// DATA ONLY: South Park GIFs for the quiz results screen, by outcome ([GIPHY id, what happens in it]).
// ace = every answer right, pass = passed with some wrong, fail = below the bar (see outcome() in app.js).
// They are loaded from GIPHY's CDN (media.giphy.com, allowed by the CSP in server/main.go), never stored here.
// The id is the last part of a giphy.com/gifs/… address. Taken in turn, so add as many as you like; one that
// no longer loads simply leaves the results without a GIF. Ids from GIPHY search results on 2026-10-16, mostly
// the official South Park channel; not looked at by eye, so swap any that don't fit.
window.GIFS = {
  ace: [
    ["iJtsMTBjeihB763Y4O", "Randy Marsh: nice"],
    ["BAxVY6DqkgvWRiSKDx", "Harrison Yates nodding: nice, nice, nice"],
    ["zkrq3bgYs9vKqWiwiO", "Harrison Yates, deadpan: nice"],
    ["3o6Ztg39UtmDK5X6Pm", "Cartman: nice one"],
    ["l2SpYeBP0MOrs8kcE", "South Park: awesome, well done"],
    ["26uffwdE7x8llYqhG", "Randy Marsh, amazed: it's beautiful"],
    ["3o6ZthM4lseiy9jhPG", "Randy Marsh dancing"],
    ["26uf75V50Ujlwqw0M", "Butters doing a happy dance"],
    ["l3vR2603FQwj4lKgM", "Cartman's victory dance"],
    ["l2SqcGdcKfMiXHt3W", "Randy Marsh with a medal"]
  ],
  pass: [
    ["s2RDorQHktYyEpTWgC", "Cartman: whatever, I do what I want"],
    ["26ufpbYV37GRrwM4U", "Cartman: whatever"],
    ["l3vR0lnnHQWQbaXzW", "South Park: dude, whatever"],
    ["3o6ZsZdNs3yE5l6hWM", "Mr. Mackey: mkay"],
    ["l2Sq0CTMnSJ99s9cA", "Randy Marsh shrugging"],
    ["l0HlUcBTMm2dcPICk", "Token shrugging"],
    ["3o6ZtjjVae76w3Oh0s", "South Park: that's fine"],
    ["l0HlKD3oHCbHWHHDW", "Stan: I'm okay"],
    ["l2SpTVR5S9WcMqZuo", "Towelie, stoned"],
    ["3o6ZtaWzv2oQNaIbjq", "Randy Marsh, sarcastic"]
  ],
  fail: [
    ["l212L7KfAzTZiazqcu", "Cartman: screw you guys, I'm going home"],
    ["QNEYEUoDmZD479Q823", "Randy Marsh: I thought this was America!"],
    ["Od0xUAFRyJE2HOWGTz", "They took our jobs!"],
    ["3o6ZteIiYu7Ua67odi", "Randy Marsh crying in a panic"],
    ["l0HlO2SDJ1BE9xrSU", "Randy Marsh screaming"],
    ["l0HlyWWnUTU2Y24oM", "Randy Marsh: no, damn it, no!"],
    ["l0HlvfSvtZKIguGAg", "Cartman: nooooo"],
    ["l0HlNHuP4fg7eZrZS", "Cartman screaming"],
    ["l0HlABrOcgYlIIn3G", "Stan's facepalm"],
    ["3o6ZtgTbLUHZtpVZle", "South Park: oh no"]
  ]
};
