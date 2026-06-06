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
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const colors = ["#f0b84a", "#c84d2f", "#006a71", "#34785e", "#2f5f8f", "#fffdf5"];
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * 120,
    size: 6 + Math.random() * 8,
    speed: 3 + Math.random() * 5,
    drift: -2 + Math.random() * 4,
    rotation: Math.random() * Math.PI,
    spin: -0.18 + Math.random() * 0.36,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));
  let frame = 0;

  canvas.className = "confetti-canvas";
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  context.scale(window.devicePixelRatio, window.devicePixelRatio);
  document.body.append(canvas);

  function draw() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    pieces.forEach((piece) => {
      piece.y += piece.speed;
      piece.x += piece.drift + Math.sin(frame / 8 + piece.rotation) * 1.2;
      piece.rotation += piece.spin;
      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.rotation);
      context.fillStyle = piece.color;
      context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.55);
      context.restore();
    });
    frame += 1;
    if (frame < 120) requestAnimationFrame(draw);
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
