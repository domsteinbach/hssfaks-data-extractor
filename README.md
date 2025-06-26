## HSSFAKS DATA EXTRACTOR

Extracts all data from the Handschriften Faksimiles pages as json.

It does so by iterating all pages via their nextPage() function of the base websites and reads out all data displayed at every page. In the end you get a JSON file containing all data extracted as a download.

HowTo run:

- import pageParser into template: <script src="pageParser.js" type="text/javascript"></script>
- call readOutManuscript(), e.g. create a button to call the readOutManuscript() function <button onclick="readOutManuscript()" type="button">Get data into normal form!</button>
- open the html of the faksimile in a browser and start at the very first page of the very first manuscript and hit the button. You will get a download of a JSON file containing all data needed to build a proper website or database.
