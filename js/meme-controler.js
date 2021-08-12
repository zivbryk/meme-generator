'use strict'

function init() {
    initCanvas();
    renderGallery();
}

function onDrawText(lineIdx) {
    drawText(lineIdx);
}

function onEditMemeText(elInput) {
    var currTxt = elInput.value;
    var meme = getMeme();
    if (meme.lines.length === 0) {
        addLineToMeme();
    }
    meme.lines[meme.selectedLineIdx].txt = currTxt;
    drawImg(meme.selectedImgId);
    onDrawText(meme.selectedLineIdx);
}

function onOpenGallery() {
    toggleScreens();
    renderGallery();
}

function renderGallery() {
    var images = getImages();
    var strHTMLs = images.map(img => {
        return `<img src="images/${img.id}.jpg" class="img-item" onclick="onPickImg(${img.id})">`
    })

    var elImgContainer = document.querySelector('.image-container');
    elImgContainer.innerHTML = strHTMLs.join('');
}

function onPickImg(imgId) {
    drawImg(imgId);
    toggleScreens();
    updateMemeImg(imgId);
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
    drawImg(meme.selectedImgId);
    onDrawText(selectedLine);
}

function onMoveLine(value) {
    var meme = getMeme();
    if (meme.lines[meme.selectedLineIdx].txt === '') return;
    meme.lines[meme.selectedLineIdx].yVal += value;
    drawImg(meme.selectedImgId);
    onDrawText(meme.selectedLineIdx);
}

function onAddLine() {
    var meme = getMeme();
    document.querySelector('.input-txt').value = '';
    meme.selectedLineIdx++;
    addLineToMeme();
    drawImg(meme.selectedImgId);
    onDrawText(meme.selectedLineIdx);
}

function onSwitchLines() {
    var meme = getMeme();

    meme.selectedLineIdx++;

    if (meme.selectedLineIdx >= meme.lines.length) {
        meme.selectedLineIdx = 0;
    }

    drawImg(meme.selectedImgId);
    onDrawText(meme.selectedLineIdx);
}

function onDeleteLine() {
    var meme = getMeme();
    document.querySelector('.input-txt').value = '';
    removeLineFromMeme(meme.selectedLineIdx);
    meme.selectedLineIdx = 0;
    drawImg(meme.selectedImgId);
    onDrawText(meme.selectedLineIdx);
}

function onChangeFont(elFontInput) {
    var currFontFam = elFontInput.value;
    setGCurrFontFam(currFontFam);
    var meme = getMeme();
    meme.lines[meme.selectedLineIdx].fontFam = currFontFam;
    drawImg(meme.selectedImgId);
    onDrawText(meme.selectedLineIdx);
}

function onChangeTextAlign(textAlignment) {
    var meme = getMeme();
    meme.lines[meme.selectedLineIdx].align = textAlignment;
    drawImg(meme.selectedImgId);
    onDrawText(meme.selectedLineIdx);
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
    drawImg(meme.selectedImgId);
    onDrawText(meme.selectedLineIdx);
}

function setStrokeColor(elColorInput) {
    var meme = getMeme();
    var strokeColor = elColorInput.value;
    setGCurrStrokeColor(strokeColor);
    meme.lines[meme.selectedLineIdx].color = strokeColor;
    drawImg(meme.selectedImgId);
    onDrawText(meme.selectedLineIdx);
}