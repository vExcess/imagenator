const canvas = document.getElementById('canvas');
let dl = Drawlite(canvas);
const { pow, floor, round, ceil, map, image, get } = dl;

let settings = {
    image: null,
    imageData: null,
    imageWidth: 400,
    imageHeight: 400,
    imageSize: 400,
    compressionLevel: 0,
    grayscale: false,
    format: "vexcess-imagenator"
};
let currentCodec = null;
let settingsUpdated = false;
let output = "";

const upload = document.getElementById('upload');
const ctx = canvas.getContext('2d');
const printBtn = document.getElementById('print-btn');

const resultsContainer = document.getElementById("results-container");
const results = document.getElementById("results");

const sizeInputEl = document.getElementById('image-size');
const compressionInputEl = document.getElementById('compression');
const grayscaleInputEl = document.getElementById('grayscale');
const formatInputs = Array.from(document.getElementsByClassName('output-option'));

const compressionValueEl = document.getElementById('compression-val');
const outputSizeVal = document.getElementById("output-size-val");

sizeInputEl.addEventListener("input", updateSettings);
compressionInputEl.addEventListener("input", updateSettings);
grayscaleInputEl.addEventListener("input", updateSettings);
formatInputs.forEach(input => input.addEventListener("input", updateSettings));

function updateSettings() {
    settings.imageSize = Number(sizeInputEl.value);
    settings.compressionLevel = Number(compressionInputEl.value);
    settings.grayscale = grayscaleInputEl.checked;
    settings.format = formatInputs.filter(el => el.checked)[0].value;

    if (settings.image !== null) {
        let drawRatio = settings.imageSize / settings.image.width;
        if (settings.image.height * drawRatio > settings.imageSize) {
            drawRatio = settings.imageSize / settings.image.height;
        }
        settings.imageWidth = round(settings.image.width * drawRatio);
        settings.imageHeight = round(settings.image.height * drawRatio);
        if (settings.imageWidth > settings.image.width || settings.imageHeight > settings.image.height) {
            settings.imageWidth = settings.image.width;
            settings.imageHeight = settings.image.height;
        }
    }

    compressionValueEl.innerText = compressionInputEl.value;

    canvas.width = settings.imageWidth;
    canvas.height = settings.imageHeight;
    ctx.drawImage(settings.image, 0, 0, canvas.width, canvas.height);

    settings.imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (settings.grayscale) {
        const pix = settings.imageData.data;
        for (let i = 0; i < pix.length; i += 4) {
            const avg = (pix[i] + pix[i + 1] + pix[i + 2]) / 3;
            pix[i] = avg;
            pix[i + 1] = avg;
            pix[i + 2] = avg;
        }
        ctx.putImageData(settings.imageData, 0, 0);
    }

    if (settings.format === "bob-lyon-imagenator"){
        currentCodec = CodecBobLyonImagenator;
    } else if (settings.format === "vexcess-imagenator"){
        currentCodec = CodecVexcessImagenator;
    } else if (settings.format === "qoi"){
        currentCodec = CodecQOIImagenator;
    }

    settingsUpdated = true;
}

function formatFileSize(bytes) {
    return round(bytes / 1024) + " KB";
}

setInterval(async () => {
    if (settingsUpdated) {
        output = await currentCodec.encode(settings);
        outputSizeVal.innerText = formatFileSize(output.length);

        const decoded = currentCodec.decode(output);
        if (decoded) {
            ctx.putImageData(decoded, 0, 0);
        }

        settingsUpdated = false;
    }
}, 100);

upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        settings.image = new Image();
        settings.image.src = event.target.result;
        settings.image.onload = updateSettings;
    };
    reader.readAsDataURL(file);
});

// 5. Download Logic
printBtn.addEventListener('click', () => {
    let code;
    if (settings.format === "vexcess-imagenator") {
        code = `//The following comment guarantees that this program will never appear on the hot list. Do not remove it unless you are using this imagenator for a legitimate use such making sprites for a game. Generated images that appear on the hotlist and are not being used for a legitamate purpose will be flagged and taken down:
// /cs/pro/5733417664643072

${currentCodec.libCode}
{
var myImage = "${output}";
}
myImage = vexIMG.decode(myImage);

imageMode(CENTER);
image(myImage, width / 2, height / 2);`;
    } else if (settings.format === "bob-lyon-imagenator") {
        code = `${currentCodec.libCode}
{
var deflatedImage = '${output}';
}
    
draw = function() {
    var img = img180.inflate(deflatedImage);
    if (! img) {
        return;
    }
    image(img, (width - img.width)/2, (height - img.height)/2);
    noLoop();
};
// that is all! Approx ${formatFileSize(output.length)}.`;
    } else if (settings.format === "qoi") {
        code = `//The following comment guarantees that this program will never appear on the hot list. Do not remove it unless you are using this imagenator for a legitimate use such making sprites for a game. Generated images that appear on the hotlist and are not being used for a legitamate purpose will be flagged and taken down:
// /cs/pro/5733417664643072

${currentCodec.libCode}
{
var myImage = "${output}";
}
myImage = QOI.base64ToPImage(myImage);

imageMode(CENTER);
image(myImage, width / 2, height / 2);`;
    }
    
    results.innerText = code;
    resultsContainer.style.zIndex = 1000;
    resultsContainer.style.display = "block";
    resultsContainer.style.left = ~~(window.innerWidth / 2 - 400) + "px";
    resultsContainer.style.top = ~~(window.innerHeight / 2 - 300) + "px";
});

function closeResults() {
    results.innerText = "";
    resultsContainer.style.zIndex = -1000;
    resultsContainer.style.display = "none";
}
document.getElementById("closeDataButton").addEventListener("click", closeResults);

function copyResultData() {
    var range = document.createRange();
    range.selectNode(results); //changed here
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    alert("data copied");
}
document.getElementById("copyDataButton").addEventListener("click", copyResultData);