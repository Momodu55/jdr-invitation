const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Propriétés de l'elfe
const elf = { x: 50, y: 450, size: 70, health: 3, img: new Image() };
elf.img.src = "elfe.png";

// Propriétés de l'ogre
const ogre = { 
    x: 400, 
    y: 200, 
    size: 120, 
    health: 3, 
    img: new Image(),
    deadImg: new Image(),
    deadSize: 150 // Taille agrandie de l'ogre mort
};
ogre.img.src = "ogre.png";
ogre.deadImg.src = "ogre mort.png";

// Image de la fumée
const smokeImg = new Image();
smokeImg.src = "smoke.png"; // Ajoutez smoke.png si elle manque, sinon commentez cette ligne.
let smokeLoaded = false;

smokeImg.onload = () => {
    smokeLoaded = true;
};

// Image de l'invitation
const invitationImg = new Image();
invitationImg.src = "Invitation.png";

// État du jeu
let gameRunning = false;

// Initialiser la musique
const musique = new Audio("musique.mp3");
musique.loop = true;

// Fond
const background = new Image();
background.src = "fond.png";

// Événement pour démarrer le jeu
document.getElementById("startImage").addEventListener("click", startGame);

function startGame() {
    gameRunning = true;
    musique.play().catch(error => {
        console.error("La lecture de la musique a échoué :", error);
    });
    document.getElementById("startImage").style.display = "none";
    canvas.style.display = "block";
    drawGame();
}

function moveElf(e) {
    if (!gameRunning) return;

    const speed = 10;
    if (e.key === "ArrowUp") elf.y -= speed;
    if (e.key === "ArrowDown") elf.y += speed;
    if (e.key === "ArrowLeft") elf.x -= speed;
    if (e.key === "ArrowRight") elf.x += speed;

    checkVictory();
    drawGame();
}

function checkVictory() {
    const elfOverlap = elf.size / 2;
    const ogreOverlap = ogre.size / 2;

    if (
        elf.x < ogre.x + ogre.size - ogreOverlap &&
        elf.x + elf.size > ogre.x + ogreOverlap &&
        elf.y < ogre.y + ogre.size - ogreOverlap &&
        elf.y + elf.size > ogre.y + ogreOverlap
    ) {
        displayInvitation();
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le fond
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Dessiner l'elfe
    ctx.drawImage(elf.img, elf.x, elf.y, elf.size, elf.size);

    // Dessiner l'ogre ou l'ogre mort
    if (ogre.health > 0) {
        ctx.drawImage(ogre.img, ogre.x, ogre.y, ogre.size, ogre.size);
    } else {
        ctx.drawImage(ogre.deadImg, ogre.x, ogre.y, ogre.deadSize, ogre.deadSize);
        if (smokeLoaded) {
            drawSmoke(); // Ajouter la fumée seulement si elle est chargée
        }
    }
}

function drawSmoke() {
    const smokeX = ogre.x + ogre.deadSize / 2 - 40;
    const smokeY = ogre.y + ogre.deadSize / 2 - 40;

    ctx.globalAlpha = 0.5;

    const offsetX = Math.random() * 10 - 5;
    const offsetY = Math.random() * 5 - 2.5;
    ctx.drawImage(smokeImg, smokeX + offsetX, smokeY + offsetY, 80, 80);

    ctx.globalAlpha = 1.0;

    requestAnimationFrame(drawGame);
}

function displayInvitation() {
    gameRunning = false;

    const combinedSound = new Audio("sword_swinging ogre dies.mp3");

    combinedSound.addEventListener("play", () => {
        ogre.img = ogre.deadImg; 
        ogre.health = 0;
        drawGame();
    });

    combinedSound.play().catch(error => {
        console.error("Erreur lors de la lecture du son : ", error);
    });

    combinedSound.onended = function() {
        musique.pause();

        // Masquer le canevas et afficher l'invitation
        canvas.style.display = "none";
        document.getElementById("startImage").style.display = "none";
        document.getElementById("message").innerHTML = '';

        const invitationElement = document.createElement("img");
        invitationElement.src = "Invitation.png";
        invitationElement.alt = "Invitation";
        invitationElement.style.width = "100%";
        invitationElement.style.height = "100%";
        invitationElement.style.position = "fixed";
        invitationElement.style.top = "0";
        invitationElement.style.left = "0";
        invitationElement.style.zIndex = "100";
        document.body.appendChild(invitationElement);

        playCelebration();
    };
}

function playCelebration() {
    const fluteSound = new Audio("flute.mp3");
    const trumpetSound = new Audio("trumpet.mp3");
    fluteSound.play();
    trumpetSound.play();
}

document.addEventListener("keydown", moveElf);
