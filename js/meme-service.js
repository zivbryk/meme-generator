'use strict'

var gElCanvas;
var gCtx;
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

function initCanvas(elCanvas, ctx) {
    gElCanvas = elCanvas;
    gCtx = ctx;
}

function getImageUrlById(imgId) {
    var currImg = gImgs.find(img => img.id === imgId);
    return currImg.url;
}

function drawImg(imgId) {
    var elCanvasImg = document.querySelector('.canvas-img-container');
    elCanvasImg.innerHTML = `<img class="img${imgId} canvas-image" src="images/${imgId}.jpg" style="display: none;">`
    var elImg = document.querySelector('.canvas-image');
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
}

function drawText(lineIdx) {
    if (gMeme.lines.length === 0) return;

    gMeme.lines.forEach((line, idx) => {
        if (line.txt === '') {
            var x = gElCanvas.width / 2;
        } else {
            var x = line.xVal;
        }


        if (line.yVal === 0) {
            switch (lineIdx) {
                case 0:
                    var y = 0.15 * gElCanvas.height;
                    break;
                case 1:
                    var y = 0.9 * gElCanvas.height;
                    break;
                case 2:
                    var y = 0.5 * gElCanvas.height;
                    break;
                default:
                    var y = 0.5 * gElCanvas.height;
                    break;

            }
        } else {
            var y = line.yVal;
        }

        var alignment = line.align;
        switch (alignment) {
            case 'left':
                x = gElCanvas.width / 4;
                break;
            case 'center':
                x = gElCanvas.width / 2;
                break;
            case 'right':
                x = gElCanvas.width / 1.333;
                break;
            default:
                x = line.xVal;
                break;
        }

        line.xVal = x;
        line.yVal = y;

        var currTxt = line.txt;
        var currFontSize = line.size;
        var currStrokeColor = line.color;
        var currFontFam = line.fontFam

        gCtx.font = `${currFontSize}px ${currFontFam}`;
        gCtx.lineWidth = 2;
        gCtx.strokeStyle = currStrokeColor;
        if (line.stroke) {
            gCtx.fillStyle = 'white';
        } else {
            gCtx.fillStyle = currStrokeColor;
        }
        gCtx.textAlign = 'center';
        gCtx.fillText(currTxt, x, y);
        gCtx.strokeText(currTxt, x, y);
        var currLineMetrics = gCtx.measureText(line.txt);

        if (idx === gMeme.selectedLineIdx) {
            gCtx.strokeStyle = 'white';
            gCtx.strokeRect(x - (currLineMetrics.width / 2) - 8, y - currFontSize, currLineMetrics.width + 18, currFontSize + 8);
        }

    })
}

function getImages() {
    var images = gImgs;
    return images;
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
    var imgContent = gElCanvas.toDataURL('image/jpeg');
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
            currLineMetrics.actualBoundingBoxDescent;
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