// ==================================DS PART ========================================

// Super class for all relevant classes with all common properties
// import pagesRestored from "../WbHAB_3619aug2/pages_index.json";
if (!zoom) {
        var zoom = 150;
}

var lastPageIdx;
// all the elements to be extracted as variables for conveience used for testing, extracting & adjusting;
// The values reflect the id of the dom element to getElementById
var elementsToExtract;
// the default elems
const defaultElemsToExtract = {
        buchMenu: 'buchMenu',
        verweiseMenu: 'verweiseMenu',
        blattAnzeige: 'blattAnzeige',
        lagenAnzeige: 'lagenAnzeige',
        lagensymbol: 'lagensymbol',
        ImgLagensymbol: 'ImgLagensymbol',
        imgFaksimilev: 'imgFaksimilev',
        imgFaksimiler: 'imgFaksimiler',
        imgFaksimile: 'imgFaksimile',
        konkordanz: "versAnzeige",
        bildbeschreibung: 'bildbeschreibung',
        miniaturansicht: 'miniaturansicht'
};

// special/individual id's of a digitalfaksimile
// if a manIndex has a special configuration, i.e. individual emelemnt id's, we add them here, so the y get used to extract data
const specialConf = [
        {
                manIdx: 4, //  Wolfenbüttel 3619 has no buchMenu element, it uses the id="textSelect" asf
                conf: {
                        buchMenu: 'textSelect',
                        ImgLagensymbol: 'lagenImg',
                        konkordanz: 'konkordanz',
                        bildbeschreibung: 'CommentButton',
                        miniaturansicht: 'verweisButton'
                }

        }

];


// config for reading out different digitalfaksimile pages; defines
// sig: the signature
// idx: for generating manusctiptId
// firstpageIdx: where a specific manuscript opens per default on reload
const manIndices = [
        { sig: '2° Cod. 217', idx: 0, firstPageIdx: 20, lastPageIdx: 746 }, // Augsburg
        { sig: 'O I 10', idx: 1, firstPageIdx: 4, lastPageIdx: 744}, // Basel
        { sig: 'Codex latinus medii aevi 276', idx: 2, firstPageIdx: 4, lastPageIdx: 521 }, // Budapest
        { sig: 'Chart. B 61', idx: 3, firstPageIdx: 28, lastPageIdx: 838 }, // Gotha
        { sig: 'Cod. Guelf. 36.19 Aug. 2°', idx: 4, firstPageIdx: 3, lastPageIdx: 382, specialElems: true }, // Wolfenbüttel 3619, specialElems indicates that there is a specialConf to use
        { sig: 'Cod. Guelf. 69.11 Aug. 2°', idx: 5, firstPageIdx: 1, lastPageIdx: 0 }, // Wolfenbüttel 6911
        { sig: 'Cod. Pal. germ. 314', idx: 6, firstPageIdx: 38, lastPageIdx: 0 }, // Heidelberg
        { sig: 'Cgm 437', idx: 7, firstPageIdx: 6, lastPageIdx: 341 }, // Cgm 437
        { sig: 'Clm 3941', idx: 8, firstPageIdx: 4, lastPageIdx: 612}, // Mue CLM 3941
        { sig: 'Clm 17835', idx: 9, firstPageIdx: 24, lastPageIdx: 526 }, // Mue CLM 17835
        { sig: 'Cod. 3214', idx: 10, firstPageIdx: 4, lastPageIdx: 653 }, // Wien
        { sig: 'Clm 27419', idx: 11, firstPageIdx: 2, lastPageIdx: 666 },
        { sig: 'MS Ger 74', idx: 12, firstPageIdx: 4, lastPageIdx: 148 }, // Cambridge
        { sig: 'Clm 3560', idx: 13, firstPageIdx: 6, lastPageIdx: 485 }, // Mue
        { sig: 'Clm 17833', idx: 14, firstPageIdx: 22, lastPageIdx: 795 }, // Mue CLM 17833
        { sig: 'Clm 17837', idx: 15, firstPageIdx: 3, lastPageIdx: 569 }, // Mue CLM 17833
        { sig: 'Clm 3561', idx: 16, firstPageIdx: 4, lastPageIdx: 694 },
        { sig: 'Clm 17832', idx: 17, firstPageIdx: 6, lastPageIdx: 590 },
        { sig: 'Cgm 98', idx: 18, firstPageIdx: 3, lastPageIdx: 64 },
        { sig: 'Clm 504', idx: 19, firstPageIdx: 2, lastPageIdx: 817 },
        { sig: 'Clm 3510A', idx: 20, firstPageIdx: 2, lastPageIdx: 242 },
        { sig: 'Clm 3515', idx: 21, firstPageIdx: 12, lastPageIdx: 354 },
        { sig: 'Clm 3559', idx: 22, firstPageIdx: 4, lastPageIdx: 786 },
        { sig: 'Clm 3562', idx: 23, firstPageIdx: 1, lastPageIdx: 742 },
        { sig: 'Clm 3564', idx: 24, firstPageIdx: 22, lastPageIdx: 788 },
        { sig: 'Clm 3569', idx: 25, firstPageIdx: 4, lastPageIdx: 478 },
        { sig: 'Clm 3596', idx: 26, firstPageIdx: 4, lastPageIdx: 612 },
        { sig: 'Clm 17830', idx: 27, firstPageIdx: 20, lastPageIdx: 816 },
        { sig: 'Clm 17831', idx: 28, firstPageIdx: 4, lastPageIdx: 674 },
        { sig: 'Clm 17834', idx: 29, firstPageIdx: 6, lastPageIdx: 726 },
        { sig: 'Clm 17836', idx: 30, firstPageIdx: 4, lastPageIdx: 298 },
        { sig: 'Clm 17838', idx: 31, firstPageIdx: 4, lastPageIdx: 482 },
        { sig: 'Clm 17848 [und Clm 26346]', idx: 32, firstPageIdx: 8, lastPageIdx: 506 },
        { sig: 'Clm 24583', idx: 33, firstPageIdx: 3, lastPageIdx: 55 },
        { sig: 'Clm 26346', idx: 34, firstPageIdx: 1, lastPageIdx: 63 },
        { sig: 'Clm 27418', idx: 35, firstPageIdx: 2, lastPageIdx: 646 },
        { sig: 'Cod. 7', idx: 36, firstPageIdx: 4, lastPageIdx: 548 },

        /* hssfaks to do:

*/

];



// On load
window.addEventListener('load', function () {
        // invisible button at the very right bottom of the screen
        extractor = document.getElementById('extractor');
        extractor.addEventListener('click', function () {
                readOutManuscript(zoom); // Pass the desired mIdx value here
        });


});

// main read all stuff out and export as json
function readOutManuscript() {
        let manuscript = createManuscript()
        console.log('manuscript: ', manuscript);
        // parseDoppelLagenSymbole()
        exportAsJson(manuscript)
}

function createManuscript() {
        // creates a new manuscript for a given idx
        let manName;
        if (document.getElementById('bezeichnung')) {
                manName = document.getElementById('bezeichnung').innerText;
        } else {
                manName = document.getElementById('manuscriptTitle').textContent;
        }
        if (!manName) {
                console.error('no manName found!');
        }
        const manConf = getManConf(manName);
        const short = manName.split(',')[0].trim();
        const manId = createId(manConf.idx.toString(), short);
        lastPageIdx = manConf.lastPageIdx;
        checkDomElements(manConf);

        if(zoom === 150) {
                const man = new Manuscript(manConf.idx, manId, manName);
                return man;
        }

        if(zoom === 50) {
                return new DoublePageManuscript(manConf.idx, manId, manName);
        }

        if(zoom === 100) {
                console.warn('The zoom can not be at 100%, please choose 150 for reading out all single pages or 50 for reading out the doppellagen symbole to the images diplayed');
        }


}

// get the configuration for a manuscript
function getManConf(name) {
        const parts = name.split(',');
        const sig = parts[2].split("(")[0].trim();
        const m = manIndices.find(i => i.sig === sig);
        if (!m) {
                console.error('no manuscript conf found, add one to manIndices first');
        }
        return m;
}

// check if all needed/used Dom elements are available/accessible
// param manConf: The configuration of a manuscript
function checkDomElements(manConf) {
        if (manConf.specialElems) {
                specialConf.forEach((conf) => {
                        if (conf.manIdx === manConf.idx) { // Check if the special configuration matches the current manuscript
                                elementsToExtract = { ...defaultElemsToExtract, ...conf.conf }; // Merge the special configuration with the default elements
                        }
                });
        } else {
                elementsToExtract = { ...defaultElemsToExtract };
        }

        console.log('=== Checking availability of elements ===')
        Object.keys(elementsToExtract).forEach((k, index) => {
                if (!document.getElementById(elementsToExtract[k])) {
                        // check if it is missing because the DF is not providing any resource
                        console.warn('T', index, '/', Object.keys(elementsToExtract).length, ': Failed elements check : Dom element ', elementsToExtract[k], ' not available in template.');
                } else { console.log('T', index, '/', Object.keys(elementsToExtract).length, ': "', elementsToExtract[k], '" successfully passed elements check') }
        });
}

class GossembrotThing {
        idx;
        id;
        label;
        description;
        parentID; // for books it is the manuscripsts id; for pages it is the books id
        isMissing; // whether it is "verschollen" or not

        constructor(idx, id, label, description, parentId) {
                this.idx = idx;
                this.id = cleanId(id);
                this.label = label;
                this.description = description;
                this.parentID = parentId;

        }
}


// The manuscript class
class DoublePageManuscript extends GossembrotThing {
        sig;
        doublePages = []; // DoublePage[]

        constructor(idx, id, label, description, parentId) {
                super(idx, id, label, description, parentId);
                this.sig = this.getSig();
                this.populate();
        }

        getSig() {
                const parts = this.label.split(',');
                const sig = parts[2].split("(")[0].trim();
                return sig;
        }

        populate() {
                for (let i = 0; (i < 450); i++) {

                        const dPage = createDoublePage(i);
                        this.doublePages.push(dPage);

                        if (typeof man !== 'undefined' && man) {
                                man.goNextPage();
                        } else {
                                goNextPage();
                        }
                }
        }
}


// The manuscript class
class Manuscript extends GossembrotThing {
        firstPageIdx; // where the pages start if there are no Einbaende yet, will be reset by constructor
        lagenBez; // eg. "Quinternio", str Todo: Unique "Lagen" per Manuscript or Book?
        sig;
        books; // Book[]
        lagen; // Lagen []
        pages; // Page[]
        covers; // manuscript covers (Einbände)
        vide_gsb; // Verweise[] "vide ..." GSB.
        comments; // Stellekommentare[]
        verWeisOptions; // simply to check if everything is collected

        constructor(idx, id, label, description, parentId, lagenBez) {
                super(idx, id, label, description, parentId);
                this.lagenBez = lagenBez;
                this.sig = this.getSig();
                this.books = [];
                this.pages = [];
                this.lagen = [];
                this.covers = [];
                this.comments = [];
                this.vide_gsb = [];
                this.isMissing = false;
                this.verWeisOptions = this.getVerweise();
                this.firstPageIdx = this.getFirstPageIdx();
                this.populate();
        }

        getSig() {
                const parts = this.label.split(',');
                const sig = parts[2].split("(")[0].trim();
                return sig;
        }

        getFirstPageIdx() {
                let firstPageIdx;
                const firstPage = manIndices.find(i => i.sig === this.sig);
                if (!firstPage) {
                        console.warn('no firstPage found, defaulting to 0');
                        firstPageIdx = 0;
                } else {
                        firstPageIdx = firstPage.firstPageIdx;
                }
                return firstPageIdx;
        }


        // reads out the verweisMenu and splits its text into an array of verweise
        getVerweise() { //Todo: remove
                const vTxt = document.getElementById('verweiseMenu').innerText;
                const vArr = vTxt.split(/\r?\n/);
                const removed = vArr.shift()
                return vArr;
        }


        // returns whether we already are on the last page of the latest iterated book
        // by comparing the latest iterated book & page with the current element. if the latestPage page equals the
        // current page we are on the last page
        isOnlastPageOnCurrentBook() {
                if (!this.books.length) {
                        return false;
                } // no book at all
                // if there are any books we check if it is the last
                const currentBook = this.books.slice(-1)[0]
                if (!currentBook.label || currentBook.label === '') {
                        return false;
                } // if there is no latest book at all
                const sameBook = getBookName() === currentBook.label; // is it the same?
                if (!currentBook.pages.length) {
                        return false;
                } // if the latest book has no pages yet
                const latestPageSoFar = currentBook.pages.slice(-1)[0]
                if (!latestPageSoFar || latestPageSoFar === '') {
                        return false;
                } // if there is no latest page at all
                // else we check if the latestbook equals the current book && latestPage equals current page
                // if this is the case, we know we are on the latest page of the latest book of the

                const samePage = document.getElementById(elementsToExtract.blattAnzeige).innerText === latestPageSoFar.label
                // if the current book in the html equals the latest book and the current page equals the latest page
                // we are on the last page
                console.log(samePage && sameBook)
                return (samePage && sameBook && currentBook.label !== "Text wählen");

        }

        isOnLastPage() {
                if (!this.pages.length || lastPageIdx === 0) { return false; }
                const latestPage = this.pages.slice(-2)[0];
                if (latestPage && lastPageIdx > 0 && latestPage.idx === lastPageIdx) {
                        return true;
                }
                return document.getElementById(elementsToExtract.blattAnzeige).innerText === latestPage.label && latestPage.label && latestPage.label !== 'eingeklebter Zettel'; // some pages are not labeled - that must not be the latest page
        }

        populate() {
                // iterating all pages and read out all data
                let currentBook;
                let bookIdx = -1; // starting at -1 to increase first hit to idx = 0
                let oldPage;
                let bookChange = false;

                let lage;
                let lagenIdx = -1;

                for (let i = 0; (i < 1000); i++) {
                        // set a new book if we have a new book
                        let bName = getBookName();
                        if (currentBook === undefined || currentBook.label !== bName) {

                                //  if the bookname changes or if there is not yet a book
                                // create a new book
                                bookIdx += 1;
                                currentBook = this.createBook(bookIdx, bName);
                                this.books.push(currentBook);
                                bookChange = true;
                        } // else we are in the same book
                        if (this.isOnLastPage()) {

                                console.warn('last page at ', this.pages.length, ' ', this.pages[this.pages.length])
                                break;
                        }
                        const page = createPage(i, currentBook.id, this.id);
                        this.pages.push(page);
                        this.updateLagen(page);
                        this.updateComments(page)
                        this.updateVerweise(page);
                        if (bookChange) {
                                this.updateBooks(currentBook, page, oldPage);
                        }
                        oldPage = page;
                        bookChange = false;
                        if (typeof man !== 'undefined' && man) {
                                man.goNextPage();
                        } else {
                                goNextPage();
                        }

                }
        }

        // update the old book with endindex of page
        updateBooks(currentBook, page, oldPage) {
                if (!currentBook || !this.books.length) { return; } // guard

                const curBook = this.books.find(book => book.id === currentBook.id);
                if (curBook) {
                        curBook.startId = page.id;
                        curBook.startIdx = page.idx;
                }

                if (!oldPage) { return; }
                // update endIdx & endPage of latest book
                const latestBook = this.books.find(book => book.id === oldPage.bookId);
                if (latestBook) {
                        latestBook.endIdx = oldPage.idx;
                        latestBook.endId = oldPage.id;
                }
        }

        createBook(bookIdx, bookName) {
                const bookId = createId(bookIdx, bookName, this.idx);
                const konkordanz = document.getElementById(elementsToExtract.konkordanz).innerText;
                return new Book(bookIdx, bookId, bookName, '', this.id, konkordanz);
        }


        updateLagen(page) {
                if (this.lagen.findIndex(l => l.id === page.lagenId) === -1) { // if the id is not yet in this.lagen
                        const lage = new Lage(
                            this.lagen.length,
                            page.lagenId,
                            page.lage + page.lagenText.split('.')[0],
                            page.lagenText,
                            page.manId,
                            page.lagenText.split(', ')[1],
                            parseInt(page.lagenText.split('.')[0]));
                        this.lagen.push(lage);
                }
        }

        updateVerweise(page) {
                if (page.hasVerweis) {
                        const verweis = new Verweis(this.vide_gsb.length, page)
                        this.vide_gsb.push(verweis);
                }
        }

        updateComments(page) {
                if (page.hasComment) {
                        const comm = new Comment(this.comments.length, page);
                        this.comments.push(comm)
                }
        }
}


function exportAsJson(manuscript) {
        const dataStr = JSON.stringify(manuscript);
        let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        let exportFileDefaultName = manuscript.id + '.json';

        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
}

class Book extends GossembrotThing {

        konkordanzTxt; // the pages belonging to the book as text

        startIdx;
        endIdx;
        startId;
        endId;

        constructor(idx, id, label, description, parentId, konkordanzTxt) {
                super(idx, id, label, description, parentId);
                this.konkordanzTxt = konkordanzTxt;
        }
}


class Lage extends GossembrotThing {
        lType; // Lagen type e.g. "Quinternio"
        manOrder; // the lagen index inside the manuscript
        isComplete;
        constructor(idx, id, label, description, parentId, lType, manOrder) {
                super(idx, id, label, description, parentId);
                this.lType = lType;
                this.manOrder = manOrder;
        }
}

class Verweis {
        idx;
        id;
        manId;
        pageId;
        page; // the text shown in the gui
        verweisLink; // the link to the html containing the data
        constructor(idx, page) {
                this.idx = idx;
                this.id = cleanId('vide_' + page.manId + '_' + page.pagina + '_' + idx);
                this.manId = page.manId;
                this.pageId = page.id;
                this.page = page.label
                this.verweisLink = page.verweisLink;
        }
}

class Comment {
        idx;
        id;
        manId;
        pageId;
        commentLink; // the link to the html containing the according comments

        constructor(idx, page) {
                this.idx = idx;
                this.id = cleanId('comm_' + page.manId + '_' + page.pagina + '_' + idx);
                this.manId = page.manId;
                this.pageId = page.id;
                this.commentLink = page.commentLink;
        }
}

class SinglePage extends GossembrotThing {
        manId;
        bookId;
        folioText; // e.g. "Bl. 86r"
        imgDir; // the image dir
        img; // the name of the image
        lage; // the "Lage" e.g. L5
        lagenId;
        lagenSymbol; // the single pages lagensymbol
        lagenText;
        hasVerweis;
        verweisLink; // Str; link to verweis*.html
        hasComment;
        comment;
        commentLink; // Stellenkommentare/Seitenkommentare
        altBlattKorrektur; // green marked page number "alt ..." with class= "k"

        // pIdx, pageId, blatt, '', blatt, img, lagenSymbol, lagenText
        constructor(idx, id, label, description, parentId, manId, folioText, imgDir, lagenSymbol, lagenText, hasComment, hasVerweis, altBlattKorrektur) {
                super(idx, id, label, description, parentId);
                this.manId = manId;
                this.bookId = parentId;
                this.folioText = folioText; // the original page text
                this.imgDir = imgDir;
                this.img = imgDir.split('/').pop();
                this.lagenSymbol = lagenSymbol; // url
                // this.lage = lagenSymbol.split('p')[0];
                this.lage = this.getLage(lagenSymbol);
                this.lagenText = lagenText;
                this.lagenId = manId + '_' + this.lage;
                this.altBlattKorrektur = altBlattKorrektur;

                // To ignore hence not complete
                // this.hasComment = hasComment;
                //if ( hasComment ) { this.commentLink =  'Wolfb_HAB_36_19_aug_2f_' + this.pagina + '_komm.html';}// To ignore hence not complete
                // this.hasVerweis = hasVerweis;// To ignore hence not complete
                //if ( hasVerweis ) { this.verweisLink =  'Wolfb_HAB_36_19_aug_2f_' + fenVer + '_verw.html';}// To ignore hence not complete
        }


        getLage(url) {
                // Get the file name from the URL
                const fileName = url.substring(url.lastIndexOf('/') + 1);
                return fileName.split('.')[0];
        }
}

class DoublePage {
        idx;
        lagenSymbol;
        lagenText;
        versoPage;
        rectoPage;
        blattangabe;

        constructor(idx, lagenSymbol, lagenText, versoPage, rectoPage, blattangabe) {
                this.idx = idx;
                this.lagenSymbol = lagenSymbol;
                this.lagenText = lagenText;
                this.versoPage = versoPage;
                this.rectoPage = rectoPage;
                this.blattangabe = blattangabe;
        }
}

function getBookName() {
        const bookNode = document.getElementById(elementsToExtract.buchMenu);
        console.log(bookNode);
        const bookName = bookNode.options[bookNode.selectedIndex]?.text !== 'Text wählen' ? bookNode.options[bookNode.selectedIndex]?.text : '';
        console.log(bookName);
        return bookName;
}

function createPage(pIdx, bookId, manId) {
        const blatt = document.getElementById(elementsToExtract.blattAnzeige).innerText;
        const altBlattKorrektur = getAltBlattKorrektur();
        console.log(blatt);
        const pageId = createId(pIdx, blatt, bookId);
        const lagenText = document.getElementById(elementsToExtract.lagenAnzeige).innerText;
        const lagenSymbol = getLagenSymbol();
        const imgV = document.getElementById(elementsToExtract.imgFaksimilev).src;
        const imgR = document.getElementById(elementsToExtract.imgFaksimiler).src;
        const maybe_img = document.getElementById(elementsToExtract.imgFaksimile).src;
        const hasComment = document.getElementById(elementsToExtract.bildbeschreibung).style.visibility !== 'hidden';
        const hasVerweis = document.getElementById(elementsToExtract.miniaturansicht).style.visibility !== 'hidden';
        const img = whateverImage(maybe_img, imgR, imgV);

        return new SinglePage(pIdx, pageId, blatt, '', bookId, manId, blatt, img, lagenSymbol, lagenText, hasComment, hasVerweis, altBlattKorrektur);
}

function createDoublePage(i) {

        const lagenText = document.getElementById(elementsToExtract.lagenAnzeige).innerText;
        const lagenSymbol = getLagenSymbol();
        const imgV = document.getElementById(elementsToExtract.imgFaksimilev).src;
        const imgR = document.getElementById(elementsToExtract.imgFaksimiler).src;
        // For Wolfenbüttel 69.11 needed hence they do have one image for a double page, so there can not be a match for single images to double lagen symbole
        const blatt = document.getElementById(elementsToExtract.blattAnzeige).innerText;

        return new DoublePage(i, lagenSymbol, lagenText, imgV, imgR, blatt);
}



function getAltBlattKorrektur() {
        const blattAnzeige = document.getElementById("blattAnzeige");
        let altBlatt = '';
        if (blattAnzeige && blattAnzeige.querySelector(".k")) {
                altBlatt = blattAnzeige.querySelector(".k").innerText;
                console.warn(altBlatt);
        }
        return altBlatt;
}

// special function hence not all digitalfaksimiles have lagensymbole, e.g. Budapest has none
function getLagenSymbol() {

        let lagenSym = '';

        if (document.getElementById(elementsToExtract.ImgLagensymbol)) {
                const lagenSymElem = document.getElementById(elementsToExtract.ImgLagensymbol)
                lagenSym = lagenSymElem.src;

        } else {
                const lagenSymElem = document.getElementsByName(elementsToExtract.ImgLagensymbol);
                lagenSym = lagenSymElem[0].src;
        }
        return lagenSym;
}

function createId(idx, name, parentId = '') {
        // simply return an id out of idx & name
        let separator = ''
        if (parentId) { separator = '_' }
        const baseId = `${parentId}${separator}${idx.toString()}_${name.split(' ').join('')}`;
        return cleanId(baseId);
}

function cleanId(str) {
        const unAllowedCharacters = ['.', ',', '$', ' ', ':', ';', '/', '"', "'", '`', '^', '~', '+', '%', '&', '(', ')', '[', ']'];
        for (const c of unAllowedCharacters) {
                str = str.replace(c, '');
        }
        return str
}

function whateverImage(img, imgR, imgV) {
        if (img && img !== '') { return img; }
        else if (imgR && imgR !== '') { return imgR; }
        else if (imgV && imgV !== '') { return imgV; }
}

// gets the short notation for a blatt, e.g. "12v" from a image name
function getBlattShort(imageName) {
        const f_name = imageName.split('.jpg')[0] // // the image name without format suffix
        const pSuffix = f_name.split('_')[3];
        const folio = pSuffix.substr(pSuffix.length - 1, 1)
        const pNum = parseInt(pSuffix.substring(0, pSuffix.length - 1), 10);
        const blattShort = pNum.toString(10).concat(folio);
        return [f_name, blattShort, folio];
}

