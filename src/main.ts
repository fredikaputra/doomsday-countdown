const bgMusic = document.getElementById("bg-music") as HTMLAudioElement;
const tickSound = document.getElementById("tick-sound") as HTMLAudioElement;
const soundToggle = document.getElementById(
  "sound-toggle",
) as HTMLButtonElement;

bgMusic.volume = 0.4;
tickSound.volume = 0.6;

let audioAllowed = false;
let isSoundOn = false;

function toggleSound(forceState?: boolean) {
  const newState = forceState !== undefined ? forceState : !isSoundOn;
  isSoundOn = newState;

  soundToggle.textContent = isSoundOn ? "Sound On" : "Sound Off";

  if (isSoundOn) {
    bgMusic.play().catch((e) => console.log("Audio play failed:", e));
  } else {
    bgMusic.pause();
  }
}

soundToggle.addEventListener("click", (e) => {
  e.stopPropagation();

  if (!audioAllowed) {
    audioAllowed = true;
    toggleSound(true);
  } else {
    toggleSound();
  }
});

function playTick() {
  if (!isSoundOn) return;
  tickSound.currentTime = 0;
  tickSound.play().catch(() => {});
}

const targetDate = new Date(2026, 11, 18, 0, 0, 0);

function updateCountdown() {
  const now = new Date();
  let diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return;

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const hours = Math.floor((diff / 1000 / 60 / 60) % 24);

  let temp = new Date(now);
  let months = 0;
  while (true) {
    const next = new Date(temp);
    next.setMonth(next.getMonth() + 1);
    if (next <= targetDate) {
      temp = next;
      months++;
    } else break;
  }

  const days = Math.floor(
    (targetDate.getTime() - temp.getTime()) / (1000 * 60 * 60 * 24),
  );

  const monthsEl = document.getElementById("months");
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (monthsEl) monthsEl.textContent = String(months).padStart(2, "0");
  if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
  if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
  if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");

  playTick();
}

updateCountdown();
setInterval(updateCountdown, 1000);

const learnMoreLink = document.getElementById("learn-more");
const heroFooter = document.getElementById("hero-footer");

const uiElements = [soundToggle, learnMoreLink, heroFooter];
let idleTimer: number;

function showUI() {
  [soundToggle, learnMoreLink].forEach((el) => {
    if (el) {
      el.classList.remove("opacity-0", "pointer-events-none");
      el.classList.add("opacity-100");
    }
  });

  if (heroFooter) {
    if (window.scrollY === 0) {
      heroFooter.classList.remove("opacity-0", "pointer-events-none");
      heroFooter.classList.add("opacity-100");
    } else {
      heroFooter.classList.remove("opacity-100");
      heroFooter.classList.add("opacity-0", "pointer-events-none");
    }
  }
}

function hideUI() {
  uiElements.forEach((el) => {
    if (el) {
      el.classList.remove("opacity-100");
      el.classList.add("opacity-0", "pointer-events-none");
    }
  });
}

function resetIdleTimer() {
  showUI();
  clearTimeout(idleTimer);
  idleTimer = setTimeout(hideUI, 5000);
}

["mousemove", "click", "touchstart", "scroll", "keydown"].forEach((evt) =>
  document.addEventListener(evt, resetIdleTimer, { passive: true }),
);

resetIdleTimer();
