/* ----------------------------------------------------
   PERSIANAS ZAMBRANA - LÓGICA DE PROGRAMACIÓN (JS)
   Funciones principales: Preloader con memoria, Menú Móvil,
   Variables editables de contacto, Auto-selección de averías,
   Efectos de scroll e Intersection Observer para navegación activa.
------------------------------------------------------- */

// 1. VARIABLES EDITABLES (Modifica estos valores según tus necesidades)
const CONFIG = {
  // Teléfono directo para llamadas (sin espacios en href)
  telefonoLlamada: "661507518", 
  
  // Teléfono para WhatsApp (con prefijo internacional, ej. 34 para España)
  telefonoWhatsapp: "34661507518", 
  
  // Mensaje por defecto cuando se contacta directamente desde el botón general
  mensajeWhatsappDefecto: "Hola Persianas Zambrana, he visto vuestra web y quiero pedir presupuesto para una reparación o instalación de persiana.",
  
  // Mensaje para el botón "Enviar foto de la persiana" (Urgencias)
  mensajeWhatsappFoto: "Hola Persianas Zambrana, quiero enviaros una foto de mi persiana para que me deis presupuesto.",
  
  // Mensaje para casos de urgencia
  mensajeWhatsappUrgencia: "Hola Persianas Zambrana, tengo una persiana atascada o rota y necesito ayuda lo antes posible.",
  
  // Duración máxima de la animación de persiana en milisegundos (4.5s)
  duracionAnimacion: 4500
};

document.addEventListener("DOMContentLoaded", () => {
  
  // Inicializaciones
  initPreloader();
  initMobileMenu();
  initContactLinks();
  initProblemConsultButtons();
  initContactForm();
  initScrollSpy();
  initBeforeAfterSliders();
  initReputationStarsObserver();
  initBlindTasselWidget();
  
});

/* ==========================================================================
   2. CONTROL DEL PRELOADER (Animación de la persiana subiendo)
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById("preloader");
  const skipButton = document.getElementById("skip-preloader");
  
  if (!preloader) return;
  
  // OPTIMIZACIÓN DE CONVERSIÓN: Si el usuario ya ha visto la animación en esta sesión,
  // la saltamos automáticamente para no molestar en la navegación repetida.
  const yaMostrado = sessionStorage.getItem("preloader_shown");
  
  if (yaMostrado === "true") {
    preloader.style.display = "none";
    return;
  }
  
  // Guardar en sesión que ya se ha mostrado
  sessionStorage.setItem("preloader_shown", "true");
  
  // Ocultar preloader tras terminar la animación principal
  const preloaderTimeout = setTimeout(() => {
    hidePreloader();
  }, CONFIG.duracionAnimacion);
  
  // Omitir manualmente al pulsar el botón "Saltar"
  skipButton.addEventListener("click", () => {
    clearTimeout(preloaderTimeout);
    hidePreloader();
  });
  
  function hidePreloader() {
    preloader.classList.add("fade-out");
    // Esperamos a que la transición de opacidad de CSS termine (800ms)
    setTimeout(() => {
      preloader.style.display = "none";
    }, 800);
  }
}

/* ==========================================================================
   3. MENÚ MÓVIL RESPONSIVE
   ========================================================================== */
function initMobileMenu() {
  const mobileToggle = document.getElementById("mobile-nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  
  if (!mobileToggle || !navMenu) return;
  
  // Toggle menú
  mobileToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    mobileToggle.classList.toggle("active");
    
    // Animación visual del botón hamburguesa
    const lines = mobileToggle.querySelectorAll(".hamburger-line");
    if (navMenu.classList.contains("open")) {
      lines[0].style.transform = "rotate(45deg) translate(5px, 6px)";
      lines[1].style.opacity = "0";
      lines[2].style.transform = "rotate(-45deg) translate(5px, -6px)";
    } else {
      lines[0].style.transform = "none";
      lines[1].style.opacity = "1";
      lines[2].style.transform = "none";
    }
  });
  
  // Cerrar menú al hacer click en cualquier enlace
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        mobileToggle.classList.remove("active");
        
        // Reset lines
        const lines = mobileToggle.querySelectorAll(".hamburger-line");
        lines[0].style.transform = "none";
        lines[1].style.opacity = "1";
        lines[2].style.transform = "none";
      }
    });
  });
}

/* ==========================================================================
   4. ENLACES DINÁMICOS DE CONTACTO (WhatsApp y Teléfono)
   ========================================================================== */
function initContactLinks() {
  // Asignar enlaces de llamada dinámica
  const callButtons = [
    document.getElementById("header-call-btn"),
    document.getElementById("hero-call-btn"),
    document.getElementById("urgency-call-btn"),
    document.getElementById("contact-call-link")
  ];
  
  callButtons.forEach(btn => {
    if (btn) btn.setAttribute("href", `tel:${CONFIG.telefonoLlamada}`);
  });
  
  // Asignar enlaces de WhatsApp dinámicos
  const whatsappHero = document.getElementById("hero-whatsapp-btn");
  const whatsappUrgencyPhoto = document.getElementById("urgency-photo-btn");
  const whatsappContactCard = document.getElementById("contact-whatsapp-link");
  const whatsappStickyMobile = document.getElementById("mobile-sticky-whatsapp");
  
  // 1. WhatsApp del Hero
  if (whatsappHero) {
    // Apunta al formulario en desktop, pero podemos preparar un enlace WhatsApp directo si se requiere.
  }
  
  // 2. Botón "Enviar foto de la persiana" (Urgencias)
  if (whatsappUrgencyPhoto) {
    const url = `https://api.whatsapp.com/send?phone=${CONFIG.telefonoWhatsapp}&text=${encodeURIComponent(CONFIG.mensajeWhatsappFoto)}`;
    whatsappUrgencyPhoto.setAttribute("href", url);
    whatsappUrgencyPhoto.setAttribute("target", "_blank");
  }
  
  // 3. Tarjeta de contacto principal WhatsApp
  if (whatsappContactCard) {
    const url = `https://api.whatsapp.com/send?phone=${CONFIG.telefonoWhatsapp}&text=${encodeURIComponent(CONFIG.mensajeWhatsappDefecto)}`;
    whatsappContactCard.setAttribute("href", url);
    whatsappContactCard.setAttribute("target", "_blank");
    whatsappContactCard.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 6px;"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>WhatsApp / Chat`;
  }
  
  // 4. Barra sticky móvil inferior
  if (whatsappStickyMobile) {
    const url = `https://api.whatsapp.com/send?phone=${CONFIG.telefonoWhatsapp}&text=${encodeURIComponent(CONFIG.mensajeWhatsappDefecto)}`;
    whatsappStickyMobile.setAttribute("href", url);
    whatsappStickyMobile.setAttribute("target", "_blank");
  }
}

/* ==========================================================================
   5. AUTO-SELECCIÓN DE AVERÍAS DESDE TARJETAS DE PROBLEMA
   ========================================================================== */
function initProblemConsultButtons() {
  const consultButtons = document.querySelectorAll(".problem-consult-btn");
  const problemSelect = document.getElementById("form-problem");
  const nameInput = document.getElementById("form-name");
  
  consultButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      // Obtener el tipo de avería de la tarjeta
      const problemType = btn.getAttribute("data-problem");
      
      if (problemSelect && problemType) {
        // Auto-seleccionar el problema en el formulario
        problemSelect.value = problemType;
        
        // Poner foco en el campo nombre para que el usuario empiece a escribir
        if (nameInput) {
          setTimeout(() => {
            nameInput.focus();
          }, 600); // Pequeño delay para que termine el scroll fluido
        }
      }
    });
  });
}

/* ==========================================================================
   6. SIMULACIÓN DE ENVÍO DE FORMULARIO DE CONTACTO
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("persianas-form");
  const successMessage = document.getElementById("form-success");
  
  if (!form || !successMessage) return;
  
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevenir recarga de página
    
    // Obtener valores para procesar
    const nombre = document.getElementById("form-name").value;
    const telefono = document.getElementById("form-phone").value;
    const averia = document.getElementById("form-problem").value;
    const mensaje = document.getElementById("form-message").value;
    
    // Formatear el mensaje según la plantilla obligatoria
    const formattedText = `Hola Persianas Zambrana, quiero pedir presupuesto.\n\nNombre: ${nombre}\nTeléfono: ${telefono}\nProblema: ${averia}\nMensaje: ${mensaje}\n\nGracias.`;
    
    // Abrir WhatsApp con el mensaje estructurado
    const url = `https://api.whatsapp.com/send?phone=${CONFIG.telefonoWhatsapp}&text=${encodeURIComponent(formattedText)}`;
    window.location.href = url;
    
    // Ocultar formulario con transición y mostrar mensaje de éxito real hacia WhatsApp
    form.style.opacity = "0";
    setTimeout(() => {
      form.style.display = "none";
      successMessage.style.display = "block";
      
      // Actualizar el texto del mensaje de éxito
      const desc = successMessage.querySelector(".form-success-desc");
      if (desc) {
        desc.textContent = "Te hemos abierto WhatsApp con tu solicitud preparada. Solo tienes que enviarla.";
      }
      
      successMessage.style.opacity = "0";
      
      // Animación de aparición suave
      setTimeout(() => {
        successMessage.style.transition = "opacity 0.5s ease";
        successMessage.style.opacity = "1";
      }, 50);
    }, 300);
  });
}

/* ==========================================================================
   7. INTERSECTION OBSERVER PARA NAVEGACIÓN ACTIVA (SCROLL SPY)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id], header[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  
  if (sections.length === 0 || navLinks.length === 0) return;
  
  const options = {
    root: null,
    rootMargin: "-20% 0px -60% 0px", // Detecta cuando la sección ocupa la parte central
    threshold: 0
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        
        // Quitar clase active de todos los links
        navLinks.forEach(link => {
          link.classList.remove("active");
          
          // Si coincide el href con el ID de la sección visible, añadir active
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, options);
  
  sections.forEach(section => {
    observer.observe(section);
  });
}

/* ==========================================================================
   8. COMPONENTE COMPARATIVO INTERACTIVO ANTES Y DESPUÉS (SLIDER)
   ========================================================================== */
function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll(".before-after-slider");
  
  sliders.forEach(slider => {
    const rangeInput = slider.querySelector(".slider-range");
    const afterImg = slider.querySelector(".after-img");
    const handle = slider.querySelector(".slider-handle");
    
    if (!rangeInput || !afterImg || !handle) return;
    
    // Función para actualizar la posición del slider
    const updateSlider = (value) => {
      afterImg.style.clipPath = `polygon(0 0, ${value}% 0, ${value}% 100%, 0 100%)`;
      handle.style.left = `${value}%`;
    };
    
    // Escuchar el evento input para cambios manuales
    rangeInput.addEventListener("input", (e) => {
      // Si el usuario arrastra, cancelamos cualquier animación automática activa
      if (slider.classList.contains("auto-animating")) {
        slider.classList.remove("auto-animating");
        cancelAutoAnimations(slider);
      }
      updateSlider(e.target.value);
    });
    
    // --- ANIMACIÓN AUTOMÁTICA DE BIENVENIDA (TEASER) ---
    // Usamos Intersection Observer para iniciar la animación solo cuando se vea el slider
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !slider.dataset.animated) {
          slider.dataset.animated = "true"; // Evitamos repetir la animación
          startTeaserAnimation(slider, rangeInput, updateSlider);
          observer.unobserve(slider);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(slider);
  });
  
  const timeoutsMap = new Map();
  
  function startTeaserAnimation(slider, rangeInput, updateSlider) {
    slider.classList.add("auto-animating");
    
    // Secuencias de movimiento suave
    const step1 = setTimeout(() => {
      rangeInput.value = 70;
      updateSlider(70);
    }, 400);
    
    const step2 = setTimeout(() => {
      rangeInput.value = 30;
      updateSlider(30);
    }, 1500);
    
    const step3 = setTimeout(() => {
      rangeInput.value = 50;
      updateSlider(50);
    }, 2600);
    
    const step4 = setTimeout(() => {
      slider.classList.remove("auto-animating");
    }, 3700);
    
    timeoutsMap.set(slider, [step1, step2, step3, step4]);
  }
  
  function cancelAutoAnimations(slider) {
    const timeouts = timeoutsMap.get(slider);
    if (timeouts) {
      timeouts.forEach(t => clearTimeout(t));
      timeoutsMap.delete(slider);
    }
  }
}

/* ==========================================================================
   9. OBSERVADOR DE SCROLL PARA LAS ESTRELLAS DE REPUTACIÓN
   ========================================================================== */
function initReputationStarsObserver() {
  const card = document.querySelector(".reputation-premium-card");
  if (!card) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        card.classList.add("animate-stars");
        observer.unobserve(entry.target); // Animación de un solo uso
      }
    });
  }, { threshold: 0.15 });

  observer.observe(card);
}

/* ==========================================================================
   10. WIDGET DE TIRADOR DE PERSIANA INTERACTIVO (SCROLL TO TOP)
   ========================================================================== */
function initBlindTasselWidget() {
  const tassel = document.getElementById("tassel-scroll-btn");
  if (!tassel) return;

  // Mostrar/ocultar según el scroll vertical
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      tassel.classList.add("visible");
    } else {
      tassel.classList.remove("visible");
    }
  });

  // Interacción al hacer click (tirón de persiana)
  tassel.addEventListener("click", () => {
    if (tassel.classList.contains("pulling")) return;

    tassel.classList.add("pulling");

    // Scroll suave hacia arriba
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    // Retirar la clase de animación física tras completarse el tirón (800ms)
    setTimeout(() => {
      tassel.classList.remove("pulling");
    }, 800);
  });
}
