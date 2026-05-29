/* ── PRELOADER PETALS ── */
(function () {
  const cont = document.getElementById ('petals');
  if (cont) {
    for (let i = 0; i < 22; i++) {
      const p = document.createElement ('div');
      p.className = 'petal';
      p.style.left = Math.random () * 100 + '%';
      p.style.animationDuration = 4 + Math.random () * 7 + 's';
      p.style.animationDelay = Math.random () * 8 + 's';
      p.style.width = 7 + Math.random () * 10 + 'px';
      p.style.height = 11 + Math.random () * 12 + 'px';
      cont.appendChild (p);
    }
  }
}) ();

/* ── PRELOADER ── */
function abrirInvitacion () {
  const pl = document.getElementById ('preloader');
  if (pl) {
    pl.classList.add ('abierto');
    setTimeout (() => {
      pl.style.display = 'none';
      document.body.style.overflow = '';
    }, 1300);
  }
  setTimeout (() => {
    const audioPlayer = document.getElementById ('audio-player');
    if (audioPlayer) audioPlayer.classList.add ('visible');
  }, 1400);
  document
    .querySelectorAll ('.reveal')
    .forEach (el => el.classList.add ('active'));

  // Intenta activar el audio de forma silenciosa al abrir
  setTimeout (() => {
    const audio = document.getElementById ('bg-audio');
    if (audio && audio.paused) {
      audio.muted = true;
      audio
        .play ()
        .then (() => {
          audio.muted = false; // Si suena, bien; si no, el usuario tendrá que tocar el botón
        })
        .catch (e => console.log ('Audio no iniciado automáticamente'));
    }
  }, 500);
}
document.body.style.overflow = 'hidden';

/* ── COUNTDOWN ── */
function updateCountdown () {
  const target = new Date ('2026-07-11T19:00:00-05:00');
  const now = new Date ();
  let diff = target - now;
  if (diff < 0) diff = 0;
  const d = Math.floor (diff / 864e5);
  const h = Math.floor (diff % 864e5 / 36e5);
  const m = Math.floor (diff % 36e5 / 6e4);
  const s = Math.floor (diff % 6e4 / 1e3);
  document.getElementById ('cd-days').textContent = String (d).padStart (
    2,
    '0'
  );
  document.getElementById ('cd-hours').textContent = String (h).padStart (
    2,
    '0'
  );
  document.getElementById ('cd-mins').textContent = String (m).padStart (
    2,
    '0'
  );
  document.getElementById ('cd-secs').textContent = String (s).padStart (
    2,
    '0'
  );
}
updateCountdown ();
setInterval (updateCountdown, 1000);

/* ── PETALS PARA COUNTDOWN Y HERO ── */
function createFallingPetal (containerSelector, colorHueRange = [8, 35]) {
  const container = document.querySelector (containerSelector);
  if (!container) return;
  const petal = document.createElement ('div');
  petal.classList.add ('petal');
  const size = Math.random () * 10 + 8;
  petal.style.width = size + 'px';
  petal.style.height = size + Math.random () * 6 + 'px';
  petal.style.left = Math.random () * 100 + '%';

  // CAMBIO 1: caída más lenta (18s–32s en vez de 8s–18s)
  const duration = Math.random () * 14 + 18;
  petal.style.animationDuration = duration + 's';

  // CAMBIO 7: delay reducido a 0s–5s para que los pocos pétalos aparezcan pronto
  petal.style.animationDelay = Math.random () * 5 + 's';

  const hue =
    colorHueRange[0] + Math.random () * (colorHueRange[1] - colorHueRange[0]);
  const sat = 50 + Math.random () * 30;
  const lig = 65 + Math.random () * 20;
  petal.style.backgroundColor = 'hsl(' + hue + ',' + sat + '%,' + lig + '%)';

  // CAMBIO 2: opacidad muy baja (0.12–0.32 en vez de 0.30–0.70)
  petal.style.opacity = (Math.random () * 0.2 + 0.12).toFixed (2);

  container.appendChild (petal);
  petal.addEventListener ('animationend', () => petal.remove ());
}

// Pétalos en countdown
// CAMBIO 5: intervalo 5500ms en vez de 2000ms
setInterval (() => createFallingPetal ('.petals-container', [20, 45]), 5500);
// CAMBIO 3: 3 pétalos iniciales cada 1200ms en vez de 8 cada 300ms
for (let i = 0; i < 3; i++)
  setTimeout (
    () => createFallingPetal ('.petals-container', [20, 45]),
    i * 1200
  );

// Pétalos en hero
// CAMBIO 6: intervalo 6000ms en vez de 1800ms
setInterval (
  () => createFallingPetal ('.hero-petals-container', [350, 20]),
  6000
);
// CAMBIO 4: 3 pétalos iniciales cada 1400ms en vez de 10 cada 250ms
for (let i = 0; i < 3; i++)
  setTimeout (
    () => createFallingPetal ('.hero-petals-container', [350, 20]),
    i * 1400
  );

/* ── INTERSECTION OBSERVER (reveal) ── */
const observer = new IntersectionObserver (
  entries => {
    entries.forEach (e => {
      if (e.isIntersecting) e.target.classList.add ('active');
    });
  },
  {threshold: 0.12}
);
document.querySelectorAll ('.reveal').forEach (el => observer.observe (el));

/* ── NAVBAR SCROLL ── */
window.addEventListener ('scroll', () => {
  const nav = document.getElementById ('navbar');
  if (nav) nav.classList.toggle ('scrolled', window.scrollY > 40);
});

/* ===== CARRUSEL AUTOMÁTICO + SWIPE TÁCTIL ===== */
document.addEventListener ('DOMContentLoaded', function () {
  const slidesContainer = document.querySelector ('.carousel-slides');
  const slides = document.querySelectorAll ('.carousel-slide');
  const prevBtn = document.querySelector ('.carousel-btn.prev');
  const nextBtn = document.querySelector ('.carousel-btn.next');
  const dotsContainer = document.querySelector ('.carousel-dots');

  if (!slidesContainer || slides.length === 0) return;

  let currentIndex = 0;
  let autoInterval;
  const intervalTime = 4000; // 4 segundos

  // Variables para swipe táctil
  let touchStartX = 0;
  let touchEndX = 0;
  let isSwiping = false;
  const minSwipeDistance = 50;

  // Crear puntos
  function createDots () {
    dotsContainer.innerHTML = '';
    slides.forEach ((_, idx) => {
      const dot = document.createElement ('div');
      dot.classList.add ('dot');
      if (idx === currentIndex) dot.classList.add ('active');
      dot.addEventListener ('click', () => goToSlide (idx));
      dotsContainer.appendChild (dot);
    });
  }

  function goToSlide (index) {
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    currentIndex = index;
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots ();
  }

  function updateDots () {
    const dots = document.querySelectorAll ('.dot');
    dots.forEach ((dot, idx) => {
      if (idx === currentIndex) dot.classList.add ('active');
      else dot.classList.remove ('active');
    });
  }

  function nextSlide () {
    if (currentIndex + 1 < slides.length) goToSlide (currentIndex + 1);
    else goToSlide (0);
  }

  function prevSlide () {
    if (currentIndex - 1 >= 0) goToSlide (currentIndex - 1);
    else goToSlide (slides.length - 1);
  }

  function startAutoSlide () {
    if (autoInterval) clearInterval (autoInterval);
    autoInterval = setInterval (() => nextSlide (), intervalTime);
  }

  function stopAutoSlide () {
    if (autoInterval) clearInterval (autoInterval);
  }

  // Eventos de botones
  if (prevBtn) {
    prevBtn.addEventListener ('click', () => {
      stopAutoSlide ();
      prevSlide ();
      startAutoSlide ();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener ('click', () => {
      stopAutoSlide ();
      nextSlide ();
      startAutoSlide ();
    });
  }

  const btnRsvp = document.querySelector ('#rsvp .btn-gold');
  btnRsvp.addEventListener ('click', e => {
    e.preventDefault (); // solo para mostrar el mensaje, luego rediriges
    const msg = document.createElement ('div');
    msg.textContent = '✨ ¡Muchas Gracias a Ti!  ✨';
    msg.style.position = 'fixed';
    msg.style.bottom = '50%';
    msg.style.left = '50%';
    msg.style.transform = 'translateX(-50%)';
    msg.style.backgroundColor = '#FFF';
    msg.style.color = '#000';
    // msg.style.backgroundColor = 'rgba(212,175,55,0.9)';
    // msg.style.color = '#fff';
    msg.style.padding = '12px 24px';
    msg.style.borderRadius = '30px';
    msg.style.fontFamily = 'var(--serif2)';
    msg.style.fontStyle = 'italic';
    msg.style.fontSize = '1.2rem';
    msg.style.zIndex = '1000';
    msg.style.opacity = '0';
    msg.style.transition = 'opacity 0.3s';
    document.body.appendChild (msg);
    setTimeout (() => (msg.style.opacity = '1'), 10);
    setTimeout (() => {
      msg.style.opacity = '0';
      setTimeout (() => msg.remove (), 1100);
      // window.location.href = btnRsvp.href; // redirige después
    }, 1500);
  });

  // Eventos táctiles (swipe)
  const carouselContainer = document.querySelector ('.carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener ('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      isSwiping = true;
      stopAutoSlide ();
    });

    carouselContainer.addEventListener (
      'touchmove',
      e => {
        if (!isSwiping) return;
        // Prevenir scroll vertical mientras se desliza horizontal
        e.preventDefault ();
      },
      {passive: false}
    );

    carouselContainer.addEventListener ('touchend', e => {
      if (!isSwiping) return;
      touchEndX = e.changedTouches[0].screenX;
      const deltaX = touchEndX - touchStartX;
      if (Math.abs (deltaX) > minSwipeDistance) {
        if (deltaX > 0) prevSlide ();
        else nextSlide ();
      }
      isSwiping = false;
      startAutoSlide ();
    });
  }

  // Pausa con mouse (opcional pero recomendado)
  if (carouselContainer) {
    carouselContainer.addEventListener ('mouseenter', stopAutoSlide);
    carouselContainer.addEventListener ('mouseleave', startAutoSlide);
  }

  // Inicializar
  createDots ();
  goToSlide (0);
  startAutoSlide ();
});

/* ── AUDIO ── */
let playing = false;

const playBtn = document.getElementById ('play-btn');
playBtn.addEventListener ('click', toggleAudio);
playBtn.addEventListener ('touchstart', toggleAudio);

function toggleAudio () {
  const audio = document.getElementById ('bg-audio');
  const btn = document.getElementById ('play-btn');
  const eq = document.getElementById ('eq');
  if (!audio) return;

  if (playing) {
    audio.pause ();
    btn.textContent = '▶';
    if (eq) eq.classList.add ('paused');
    playing = false;
  } else {
    // En móviles, a veces hay que recargar el audio si falló la primera vez
    audio
      .play ()
      .then (() => {
        btn.textContent = '⏸';
        if (eq) eq.classList.remove ('paused');
        playing = true;
      })
      .catch (error => {
        console.log ('Error al reproducir:', error);
        // Opcional: mostrar un mensaje al usuario
        alert (
          'Para escuchar la música, toca de nuevo el botón después de interactuar con la página.'
        );
      });
  }
}

// Intento de autoplay silencioso al principio
// const audioEl = document.getElementById ('bg-audio');
// if (audioEl) {
//   audioEl.muted = true;
//   audioEl
//     .play ()
//     .then (() => {
//       audioEl.muted = false;
//     })
//     .catch (() => {});
// }

/* ── COPIAR NEQUI ── */
function copiarNequi () {
  navigator.clipboard.writeText ('3027300264').then (() => {
    const msg = document.getElementById ('copy-msg');
    if (msg) {
      msg.textContent = '✓ Número copiado al portapapeles';
      setTimeout (() => (msg.textContent = ''), 2500);
    }
  });
}

/* ===== MODAL DE GOOGLE FORMS ===== */
document.addEventListener ('DOMContentLoaded', function () {
  // Elementos del modal
  const modal = document.getElementById ('modal-googleform');
  const btnAbrir = document.getElementById ('btn-abrir-modal-rsvp');
  const btnCerrar = document.getElementById ('btn-cerrar-modal-rsvp');
  const iframe = document.getElementById ('iframe-googleform');

  // Si no existen los elementos, salimos para evitar errores
  if (!modal || !btnAbrir || !btnCerrar) return;

  let formularioEnviado = false;

  // ABRIR MODAL
  btnAbrir.addEventListener ('click', function () {
    modal.style.display = 'flex';
    formularioEnviado = false;
    document.body.style.overflow = 'hidden'; // Evita scroll detrás del modal
  });

  // CERRAR MODAL (por botón)
  btnCerrar.addEventListener ('click', function () {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  });

  // CERRAR MODAL (click fuera del contenido)
  modal.addEventListener ('click', function (e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  // DETECTAR ENVÍO DEL FORMULARIO (cuando el iframe recarga)
  iframe.addEventListener ('load', function () {
    // Si es la primera carga (el iframe se acaba de crear), no hacemos nada
    if (!formularioEnviado) {
      formularioEnviado = true;
      return;
    }

    // Si ya se había enviado antes, significa que es la página de "gracias"
    // Entonces cerramos el modal automáticamente
    if (formularioEnviado) {
      setTimeout (function () {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        formularioEnviado = false;
      }, 1500); // Espera 1.5 segundos para que el usuario vea el mensaje de confirmación
    }
  });
});

/* ===== CORAZONES FLOTANTES EN RSVP ===== */
(function () {
  const rsvpBtn = document.querySelector ('#rsvp .btn-gold');
  if (!rsvpBtn) return;

  // Puedes elegir entre "❤️" (corazón rojo), "🌸" (flor), "✨" (brillo), "💖" (corazón brillante)
  const symbols = ['❤️', '💖', '🌸', '✨', '💕', '💗'];

  // Número de elementos flotantes por clic (entre 3 y 6)
  const minCount = 5;
  const maxCount = 10;

  // Función para crear un elemento flotante en una posición cercana al botón
  function createFloatingElement (symbol, x, y) {
    const el = document.createElement ('div');
    el.textContent = symbol;
    // Usamos clase floating-heart (puedes cambiarla a floating-petal si quieres)
    el.className = 'floating-heart';
    // Posición absoluta con respecto al viewport
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    // Desplazamiento aleatorio horizontal para que se dispersen
    const randomOffsetX = (Math.random () - 0.5) * 60;
    el.style.setProperty ('--offset-x', randomOffsetX + 'px');
    // Añadimos una pequeña variación en la duración de la animación
    const duration = 0.8 + Math.random () * 0.8;
    el.style.animationDuration = duration + 's';
    // Rotación inicial aleatoria
    const randomRotate = (Math.random () - 0.5) * 40;
    el.style.transform = `rotate(${randomRotate}deg)`;
    document.body.appendChild (el);
    // Eliminar después de la animación
    setTimeout (() => el.remove (), duration * 1000);
  }

  // Función principal al hacer clic
  function onRsvpClick (event) {
    // Prevenir la redirección inmediata para que se vean los corazones
    event.preventDefault ();

    // Obtener las coordenadas del botón en la ventana
    const rect = rsvpBtn.getBoundingClientRect ();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Número aleatorio de elementos
    const count =
      Math.floor (Math.random () * (maxCount - minCount + 1)) + minCount;

    for (let i = 0; i < count; i++) {
      // Elegir un símbolo al azar
      const randomSymbol =
        symbols[Math.floor (Math.random () * symbols.length)];
      // Desplazamiento aleatorio alrededor del centro del botón (dentro de un radio de 40px)
      const offsetX = (Math.random () - 0.5) * 80;
      const offsetY = (Math.random () - 0.5) * 60;
      const x = centerX + offsetX;
      const y = centerY + offsetY;
      createFloatingElement (randomSymbol, x, y);
    }

    // Esperar un momento (450ms) para que se vea la animación y luego redirigir
    setTimeout (() => {
      // window.location.href = rsvpBtn.href;
      window.open (rsvpBtn.href, '_blank');
    }, 1200);
  }

  // Asignar el evento
  rsvpBtn.addEventListener ('click', onRsvpClick);
}) ();
