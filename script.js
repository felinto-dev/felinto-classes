const toast = document.querySelector(".toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text.trim());
    showToast("Copiado");
  } catch {
    const area = document.createElement("textarea");
    area.value = text.trim();
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    showToast("Copiado");
  }
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.copy);
    if (!target) return;
    copyText(target.innerText);
  });
});

document.querySelectorAll("[data-copy-text]").forEach((button) => {
  button.addEventListener("click", () => copyText(button.dataset.copyText));
});

const stepChecks = [...document.querySelectorAll("[data-step-check]")];
const storageKey = "skills-class-step-checks";

function getSavedSteps() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "{}");
  } catch {
    localStorage.removeItem(storageKey);
    return {};
  }
}

function saveStep(input) {
  const saved = getSavedSteps();
  saved[input.dataset.stepCheck] = input.checked;
  localStorage.setItem(storageKey, JSON.stringify(saved));
}

function launchConfetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const colors = ["#f0b84a", "#c84d2f", "#006a71", "#34785e", "#2f5f8f", "#fffdf5"];
  const catColors = ["#fff6df", "#f0b84a", "#d98555", "#5b6570", "#17212b"];
  const makePiece = (type = "confetti") => ({
    type,
    x: Math.random() * window.innerWidth,
    y: -30 - Math.random() * window.innerHeight * 0.35,
    size: type === "cat" ? 18 + Math.random() * 14 : 5 + Math.random() * 10,
    speed: type === "cat" ? 2.2 + Math.random() * 2.8 : 3.2 + Math.random() * 5.6,
    drift: -2.8 + Math.random() * 5.6,
    swing: 0.7 + Math.random() * 1.8,
    rotation: Math.random() * Math.PI * 2,
    spin: type === "cat" ? -0.035 + Math.random() * 0.07 : -0.22 + Math.random() * 0.44,
    color: type === "cat"
      ? catColors[Math.floor(Math.random() * catColors.length)]
      : colors[Math.floor(Math.random() * colors.length)]
  });
  const pieces = [
    ...Array.from({ length: 150 }, () => makePiece()),
    ...Array.from({ length: 22 }, () => makePiece("cat"))
  ];
  let frame = 0;

  canvas.className = "confetti-canvas";
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  context.scale(window.devicePixelRatio, window.devicePixelRatio);
  document.body.append(canvas);

  function drawCat(piece) {
    const s = piece.size;
    context.fillStyle = piece.color;
    context.strokeStyle = "#17212b";
    context.lineWidth = Math.max(1.5, s * 0.07);
    context.lineJoin = "round";

    context.beginPath();
    context.moveTo(-s * 0.43, -s * 0.1);
    context.lineTo(-s * 0.34, -s * 0.57);
    context.lineTo(-s * 0.06, -s * 0.25);
    context.moveTo(s * 0.06, -s * 0.25);
    context.lineTo(s * 0.34, -s * 0.57);
    context.lineTo(s * 0.43, -s * 0.1);
    context.fill();
    context.stroke();

    context.beginPath();
    context.ellipse(0, 0, s * 0.52, s * 0.43, 0, 0, Math.PI * 2);
    context.closePath();
    context.fill();
    context.stroke();

    context.fillStyle = piece.color === "#17212b" ? "#fffdf5" : "#17212b";
    context.beginPath();
    context.arc(-s * 0.17, -s * 0.05, s * 0.035, 0, Math.PI * 2);
    context.arc(s * 0.17, -s * 0.05, s * 0.035, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = piece.color === "#17212b" ? "#fffdf5" : "#17212b";
    context.lineWidth = Math.max(1, s * 0.045);
    context.beginPath();
    context.moveTo(0, s * 0.02);
    context.lineTo(-s * 0.05, s * 0.09);
    context.moveTo(0, s * 0.02);
    context.lineTo(s * 0.05, s * 0.09);
    context.moveTo(-s * 0.27, s * 0.03);
    context.lineTo(-s * 0.47, -s * 0.02);
    context.moveTo(s * 0.27, s * 0.03);
    context.lineTo(s * 0.47, -s * 0.02);
    context.stroke();
  }

  function draw() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let hasVisiblePieces = false;
    pieces.forEach((piece) => {
      piece.y += piece.speed;
      piece.x += piece.drift + Math.sin(frame / 8 + piece.rotation) * piece.swing;
      piece.rotation += piece.spin;
      if (piece.y - piece.size < window.innerHeight) hasVisiblePieces = true;
      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.rotation);
      if (piece.type === "cat") {
        drawCat(piece);
      } else {
        context.fillStyle = piece.color;
        context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.55);
      }
      context.restore();
    });
    frame += 1;
    if (hasVisiblePieces) requestAnimationFrame(draw);
    else canvas.remove();
  }

  requestAnimationFrame(draw);
}

const savedSteps = getSavedSteps();
stepChecks.forEach((input) => {
  input.checked = Boolean(savedSteps[input.dataset.stepCheck]);
  input.addEventListener("change", () => {
    saveStep(input);
    if (input.checked) launchConfetti();
  });
});
