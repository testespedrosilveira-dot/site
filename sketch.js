let fileNames = [
  "https://ik.imagekit.io/q3d43lw6h/site/07.png",
  "https://ik.imagekit.io/q3d43lw6h/site/BudMag_002.jpeg?updatedAt=1762471376503",
  "https://ik.imagekit.io/q3d43lw6h/site/BudMag_003.jpeg?updatedAt=1762471375733",
  "https://ik.imagekit.io/q3d43lw6h/site/BudMag_004.jpeg",
  "https://ik.imagekit.io/q3d43lw6h/site/BudMag_005.jpeg?updatedAt=1762471377127",
  "https://ik.imagekit.io/q3d43lw6h/site/BudMag_006.jpeg",
  "https://ik.imagekit.io/q3d43lw6h/site/BudMag_007.jpeg",
  "https://ik.imagekit.io/q3d43lw6h/site/BudMag_009.jpeg?updatedAt=1762471376125"
];

let imgs = [];
let imgsGray = []; // versão preto e branco
let tiles = [];

let density = 3;
let tileSize = 52;
let ellipseW, ellipseH;

function preload() {
  for (let f of fileNames) {
    let img = loadImage(f);
    imgs.push(img);

    // cria versão preto-e-branco
    imgsGray.push(img); // placeholder, substituído no setup()
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

      imgsGray[i].pixels[p]   = gray;
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
    let r = sqrt(random()); // distribuição uniforme

    let px = width / 2  + (ellipseW / 2) * r * cos(angle);
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

    if (d < tileSize * 1.3) {
      t.rot = lerp(t.rot, 0.10, 0.25);
      t.scale = lerp(t.scale, 1.45, 0.25);
      isMain = true;
    } else if (d < tileSize * 3) {
      t.rot = lerp(t.rot, 0, 0.15);
      t.scale = lerp(t.scale, 0.80, 0.12);
    } else {
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
