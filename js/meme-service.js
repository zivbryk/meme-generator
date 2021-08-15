'use strict'

var gCurrStrokeColor = 'black';
var gCurrFontFam = 'Impact'

var gKeywords = {
    'happy': 12,
    'funny puk': 1
}

var gImgs = [{
        id: 1,
        url: './images/1.jpg',
        keywords: ['happy']
    },
    {
        id: 2,
        url: './images/2.jpg',
        keywords: ['happy']
    },
    {
        id: 3,
        url: './images/3.jpg',
        keywords: ['happy']
    },
    {
        id: 4,
        url: './images/4.jpg',
        keywords: ['happy']
    },
    {
        id: 5,
        url: './images/5.jpg',
        keywords: ['happy']
    },
    {
        id: 6,
        url: './images/6.jpg',
        keywords: ['happy']
    },
    {
        id: 7,
        url: './images/7.jpg',
        keywords: ['happy']
    },
    {
        id: 8,
        url: './images/8.jpg',
        keywords: ['happy']
    },
    {
        id: 9,
        url: './images/9.jpg',
        keywords: ['happy']
    },
    {
        id: 10,
        url: './images/10.jpg',
        keywords: ['happy']
    },
    {
        id: 11,
        url: './images/11.jpg',
        keywords: ['happy']
    },
    {
        id: 12,
        url: './images/12.jpg',
        keywords: ['happy']
    },
    {
        id: 12,
        url: './images/12.jpg',
        keywords: ['happy']
    },
    {
        id: 14,
        url: './images/14.jpg',
        keywords: ['happy']
    },
    {
        id: 15,
        url: './images/15.jpg',
        keywords: ['happy']
    },
    {
        id: 16,
        url: './images/16.jpg',
        keywords: ['happy']
    },
    {
        id: 17,
        url: './images/17.jpg',
        keywords: ['happy']
    },
    {
        id: 18,
        url: './images/18.jpg',
        keywords: ['happy']
    }

];

var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: []
}

function getImageUrlById(imgId) {
    var currImg = gImgs.find(img => img.id === imgId);
    return currImg.url;
}

function getLinePos(line, lineIdx) {
    var x;
    var y;

    //Set X:
    var alignment = line.align;
    switch (alignment) {
        case 'left':
            x = gCanvas.width / 4;
            break;
        case 'center':
            x = gCanvas.width / 2;
            break;
        case 'right':
            x = gCanvas.width / 1.333;
            break;
            //For dragged line
        case '':
            x = line.xVal;
            break;
    }

    //Set Y:
    if (line.yVal === 0) {
        switch (lineIdx) {
            case 0:
                y = 0.15 * gCanvas.height;
                break;
            case 1:
                y = 0.9 * gCanvas.height;
                break;
            case 2:
                y = 0.5 * gCanvas.height;
                break;
            default:
                //For lines > 2    
                y = 0.5 * gCanvas.height;
                break;
        }
    } else {
        y = line.yVal;
    }

    line.xVal = x;
    line.yVal = y;
    return {
        x,
        y
    };
}

function getImages() {
    return gImgs;
}

function getMeme() {
    return gMeme;
}

function updateMemeImg(imgId) {
    gMeme.selectedImgId = imgId;
}

function addLineToMeme() {
    gMeme.lines.push({
        txt: '',
        size: 40,
        align: 'center',
        color: gCurrStrokeColor,
        fontFam: gCurrFontFam,
        stroke: true,
        yVal: 0,
        xVal: 0,
        isDrag: false
    })
}

function removeLineFromMeme(idx) {
    gMeme.lines.splice(idx, 1);
}

function downloadImg(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent;
}

function setGCurrStrokeColor(strokeColor) {
    gCurrStrokeColor = strokeColor;
}

function setGCurrFontFam(currFontFam) {
    gCurrFontFam = currFontFam;
}

function isLineClicked(clickedPos) {

    var isClickInLine = false;

    gMeme.lines.forEach((currLine, idx) => {

        var linePosX = currLine.xVal;
        var linePosY = currLine.yVal;

        var currLineMetrics = gCtx.measureText(currLine.txt);
        var currLineWidth = currLineMetrics.width;
        var currLineHeight = currLineMetrics.actualBoundingBoxAscent +
            currLineMetrics.actualBoundingBoxDescent; //change to lineheight or text size
        var isXClickInLine = ((linePosX - (currLineWidth / 2)) <= clickedPos.x) &&
            (clickedPos.x <= (linePosX + (currLineWidth / 2)));
        var isYClickInLine = ((linePosY - (currLineHeight / 2)) <= clickedPos.y) &&
            (clickedPos.y <= (linePosY + currLineHeight));

        if (isXClickInLine && isYClickInLine) {
            gMeme.selectedLineIdx = idx;

            isClickInLine = isXClickInLine && isYClickInLine;
        }
    })

    return isClickInLine;
}

function setLineDrag(isDrag) {
    var currLine = gMeme.lines[gMeme.selectedLineIdx];
    if (!currLine) return;
    currLine.isDrag = isDrag;
    currLine.align = '';
}

function getLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function moveLine(dx, dy) {
    var currLine = gMeme.lines[gMeme.selectedLineIdx];
    currLine.xVal += dx;
    currLine.yVal += dy;
}