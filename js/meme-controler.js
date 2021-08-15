'use strict'

var gStartPos;
var gCanvas;
var gCtx;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

function init() {
    initCanvas();
    resizeCanvas();
    renderGallery();
    addListeners();
    window.addEventListener('resize', resizeCanvas);
}

function initCanvas() {
    gCanvas = document.getElementById('canvas');
    gCtx = gCanvas.getContext('2d');
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth;
    gCanvas.height = elContainer.offsetHeight;
    // Note: changing the canvas dimension this way clears the canvas
    var meme = getMeme();
    renderCanvas(meme.selectedImgId, 0);
}

function addListeners() {
    addMouseListeners();
    addTouchListeners();
}

function addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove);
    gCanvas.addEventListener('mousedown', onDown);
    gCanvas.addEventListener('mouseup', onUp);
}

function addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMove);
    gCanvas.addEventListener('touchstart', onDown);
    gCanvas.addEventListener('touchend', onUp);
}


function onDown(ev) {
    const pos = getEvPos(ev);
    if (!isLineClicked(pos)) return;
    setLineDrag(true);
    gStartPos = pos;
    document.body.style.cursor = 'grabbing';
}

function onMove(ev) {
    const line = getLine();

    if (!line) return;

    if (line.isDrag) {
        const pos = getEvPos(ev);
        const dx = pos.x - gStartPos.x;
        const dy = pos.y - gStartPos.y;
        moveLine(dx, dy);
        gStartPos = pos;
        var meme = getMeme();
        drawImg(meme.selectedImgId);
        drawText(meme.selectedLineIdx);
    }
}

function onUp() {
    setLineDrag(false)
    document.body.style.cursor = 'grab';
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos;
}

function onEditMemeText(elInput) {
    var currTxt = elInput.value;
    var meme = getMeme();
    if (meme.lines.length === 0) {
        addLineToMeme();
    }
    meme.lines[meme.selectedLineIdx].txt = currTxt;
    renderCanvas(meme.selectedImgId, meme.selectedLineIdx)
}

function renderCanvas(imgId, lineIdx) {
    drawImg(imgId);
    drawText(lineIdx);
}

function drawImg(imgId) {
    if (imgId === 0) return;
    var elCanvasImg = document.querySelector('.canvas-img-container');
    elCanvasImg.innerHTML = `<img class="img${imgId} canvas-img"
     src="images/${imgId}.jpg" style="display: none;">`;

    var elImg = document.querySelector('.canvas-img');

    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
}

function drawText(lineIdx) {
    //if moving to controlleradd: var meme = getMeme();
    if (gMeme.lines.length === 0) return;

    gMeme.lines.forEach((line, idx) => {
        var {
            x,
            y
        } = getLinePos(line, lineIdx);

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
            gCtx.strokeRect(x - (currLineMetrics.width / 2) - 8, y - currFontSize,
                currLineMetrics.width + 18, currFontSize + 8);
        }
    })
}

function onOpenGallery() {
    toggleScreens();
    renderGallery();
    onToggleMenu();
}

function renderGallery() {
    var images = getImages();
    var strHTMLs = images.map(img => {
        return `<img src="images/${img.id}.jpg" class="img-item"
                 onclick="onPickImg(${img.id})">`
    })

    var elImgContainer = document.querySelector('.image-container');
    elImgContainer.innerHTML = strHTMLs.join('');
}

function onPickImg(imgId) {
    toggleScreens();
    resizeCanvas();
    updateMemeImg(imgId);
    drawImg(imgId);
}

function toggleScreens() {
    if (document.querySelector('.meme-editor').classList.contains('hide')) {
        document.querySelector('.meme-editor').classList.remove('hide');
        document.querySelector('.gallery-container').classList.add('hide');
    } else {
        document.querySelector('.meme-editor').classList.add('hide');
        document.querySelector('.gallery-container').classList.remove('hide');
    }
}

function onChangeFontSize(value) {
    var meme = getMeme();
    var selectedLine = meme.selectedLineIdx;
    meme.lines[selectedLine].size += value;
    renderCanvas(meme.selectedImgId, selectedLine);
}

function onMoveLine(value) {
    var meme = getMeme();
    var currLine = meme.lines[meme.selectedLineIdx];
    if (currLine.txt === '') return;

    if (currLine.yVal < 0 ||
        currLine.yVal > gCanvas.height ||
        currLine.x < 0 ||
        currLine.xVal > (gCanvas.width - 10)) return;
    meme.lines[meme.selectedLineIdx].yVal += value;
    renderCanvas(meme.selectedImgId, meme.selectedLineIdx);
}

function onAddLine() {
    var meme = getMeme();
    document.querySelector('.input-txt').value = '';
    meme.selectedLineIdx++;
    addLineToMeme();
    renderCanvas(meme.selectedImgId, meme.selectedLineIdx);
}

function onSwitchLines() {
    var meme = getMeme();

    meme.selectedLineIdx++;

    if (meme.selectedLineIdx >= meme.lines.length) {
        meme.selectedLineIdx = 0;
    }

    renderCanvas(meme.selectedImgId, meme.selectedLineIdx);
}

function onDeleteLine() {
    var meme = getMeme();
    document.querySelector('.input-txt').value = '';
    removeLineFromMeme(meme.selectedLineIdx);
    meme.selectedLineIdx = 0;

    renderCanvas(meme.selectedImgId, meme.selectedLineIdx);
}

function onChangeFont(elFontInput) {
    var currFontFam = elFontInput.value;
    setGCurrFontFam(currFontFam);
    var meme = getMeme();
    meme.lines[meme.selectedLineIdx].fontFam = currFontFam;
    renderCanvas(meme.selectedImgId, meme.selectedLineIdx);
}

function onChangeTextAlign(textAlignment) {
    var meme = getMeme();
    meme.lines[meme.selectedLineIdx].align = textAlignment;
    renderCanvas(meme.selectedImgId, meme.selectedLineIdx);
}

function onDownload(elLink) {
    downloadImg(elLink)
}

function onToggleStroke() {
    var meme = getMeme();
    var isStroke = meme.lines[meme.selectedLineIdx].stroke;
    if (isStroke) {
        meme.lines[meme.selectedLineIdx].stroke = false;
    } else {
        meme.lines[meme.selectedLineIdx].stroke = true;
    }
    renderCanvas(meme.selectedImgId, meme.selectedLineIdx);
}

function setStrokeColor(elColorInput) {
    var meme = getMeme();
    var strokeColor = elColorInput.value;
    setGCurrStrokeColor(strokeColor);
    meme.lines[meme.selectedLineIdx].color = strokeColor;
    renderCanvas(meme.selectedImgId, meme.selectedLineIdx);
}

function onToggleMenu() {
    document.querySelector('body').classList.toggle('menu-open');
}