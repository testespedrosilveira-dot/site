let fileNames = [
  "07.png",
  "BudMag_002.jpeg",
  "BudMag_003.jpeg",
  "BudMag_004.jpeg",
  "BudMag_005.jpeg",
  "BudMag_006.jpeg",
  "BudMag_007.jpeg",
  "BudMag_009.jpeg"
];

let imgs = [];
let imgsGray = []; // versão preto e branco
let tiles = [];

let density = 3;
let tileSize = 52;
let ellipseW, ellipseH;

function preload() {
  for (let f of fileNames) {
    let img = loadImage(f); // carrega diretamente da raiz
    imgs.push(img);

    // placeholder para grayscale, será gerado no setup
    imgsGray.push(img);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  ellipseW = width * 0.95;
  ellipseH = height * 0.75;

  // gerar versões grayscale reais
  for (let i = 0; i < imgs.length; i++) {
    imgsGray[i] = createImage(imgs[i].width, imgs[i].height);
    imgsGray[i].copy(imgs[i], 0, 0, imgs[i].width, imgs[i].height, 0, 0, imgs[i].width, imgs[i].height);

    imgsGray[i].loadPixels();
    for (let p = 0; p < imgsGray[i].pixels.length; p += 4) {
      let r = imgsGray[i].pixels[p];
      let g = imgsGray[i].pixels[p + 1];
      let b = imgsGray[i].pixels[p + 2];
      let gray = (r + g + b) / 3;

      imgsGray[i].pixels[p] = gray;
      imgsGray[i].pixels[p + 1] = gray;
      imgsGray[i].pixels[p + 2] = gray;
    }
    imgsGray[i].updatePixels();
  }

  generateRandomEllipseTiles();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  ellipseW = width * 0.95;
  ellipseH = height * 0.75;
  generateRandomEllipseTiles();
}

function generateRandomEllipseTiles() {
  tiles = [];

  let baseCount = floor((ellipseW * ellipseH) / (tileSize * tileSize));
  let totalTiles = baseCount * density;

  for (let i = 0; i < totalTiles; i++) {
    let angle = random(TWO_PI);
    let r = sqrt(random());

    let px = width / 2 + (ellipseW / 2) * r * cos(angle);
    let py = height / 2 + (ellipseH / 2) * r * sin(angle);

    tiles.push({
      x: px,
      y: py,
      imgColor: imgs[i % imgs.length],
      imgGray: imgsGray[i % imgsGray.length],
      rot: 0,
      scale: 1
    });
  }
}

function draw() {
  background(240);

  for (let t of tiles) {
    let d = dist(mouseX, mouseY, t.x, t.y);

    let isMain = false;

    // tile principal (colorido + destaque)
    if (d < tileSize * 1.3) {
      t.rot = lerp(t.rot, 0.10, 0.25);
      t.scale = lerp(t.scale, 1.45, 0.25);
      isMain = true;
    }
    // vizinhos encolhendo (P&B)
    else if (d < tileSize * 3) {
      t.rot = lerp(t.rot, 0, 0.15);
      t.scale = lerp(t.scale, 0.80, 0.12);
    }
    // longe (P&B)
    else {
      t.rot = lerp(t.rot, 0, 0.1);
      t.scale = lerp(t.scale, 1.0, 0.1);
    }

    push();
    translate(t.x, t.y);
    rotate(t.rot);
    scale(t.scale);
    imageMode(CENTER);

    if (isMain) {
      image(t.imgColor, 0, 0, tileSize, tileSize);
    } else {
      image(t.imgGray, 0, 0, tileSize, tileSize);
    }

    pop();
  }
}
