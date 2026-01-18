const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

const yearTarget = document.querySelector('[data-year]');
if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

const serviceForm = document.querySelector('[data-service-form]');
if (serviceForm) {
  const successMessage = document.querySelector('[data-success-message]');
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === '1' && successMessage) {
    successMessage.classList.remove('hidden');
  }

  serviceForm.addEventListener('submit', (event) => {
    const requiredFields = serviceForm.querySelectorAll('[required]');
    let hasErrors = false;

    requiredFields.forEach((field) => {
      const errorTarget = serviceForm.querySelector(`[data-error-for=\"${field.id}\"]`);
      if (!field.value.trim()) {
        hasErrors = true;
        field.setAttribute('aria-invalid', 'true');
        if (errorTarget) {
          errorTarget.textContent = 'This field is required.';
        }
      } else {
        field.removeAttribute('aria-invalid');
        if (errorTarget) {
          errorTarget.textContent = '';
        }
      }
    });

    if (hasErrors) {
      event.preventDefault();
      return;
    }

    const submitButton = serviceForm.querySelector('button[type=\"submit\"]');
    if (submitButton) {
      submitButton.setAttribute('disabled', 'disabled');
      submitButton.textContent = 'Submitting...';
    }
  });
}

const lightboxImages = document.querySelectorAll('[data-lightbox]');
const lightboxModal = document.querySelector('[data-lightbox-modal]');
const lightboxImage = document.querySelector('[data-lightbox-image]');
const lightboxCaption = document.querySelector('[data-lightbox-caption]');
const lightboxClose = document.querySelector('[data-lightbox-close]');
const lightboxPrev = document.querySelector('[data-lightbox-prev]');
const lightboxNext = document.querySelector('[data-lightbox-next]');
let currentLightboxIndex = 0;
let lastFocusedElement = null;

const closeLightbox = () => {
  if (lightboxModal) {
    lightboxModal.setAttribute('aria-hidden', 'true');
  }
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
};

const updateLightbox = (index) => {
  const images = Array.from(lightboxImages);
  const target = images[index];
  if (!target || !lightboxImage || !lightboxCaption) {
    return;
  }

  currentLightboxIndex = index;
  lightboxImage.src = target.src;
  lightboxImage.alt = target.alt;
  lightboxCaption.textContent = target.nextElementSibling ? target.nextElementSibling.textContent : '';

  if (lightboxPrev && lightboxNext) {
    lightboxPrev.disabled = currentLightboxIndex === 0;
    lightboxNext.disabled = currentLightboxIndex === images.length - 1;
  }
};

if (
  lightboxImages.length &&
  lightboxModal &&
  lightboxImage &&
  lightboxCaption &&
  lightboxClose &&
  lightboxPrev &&
  lightboxNext
) {
  const getFocusableElements = () =>
    Array.from(
      lightboxModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('disabled'));

  lightboxImages.forEach((img, index) => {
    img.addEventListener('click', () => {
      lastFocusedElement = document.activeElement;
      updateLightbox(index);
      lightboxModal.setAttribute('aria-hidden', 'false');
      const focusable = getFocusableElements();
      if (focusable.length) {
        focusable[0].focus();
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => updateLightbox(currentLightboxIndex - 1));
  lightboxNext.addEventListener('click', () => updateLightbox(currentLightboxIndex + 1));

  lightboxModal.addEventListener('click', (event) => {
    if (event.target === lightboxModal) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (lightboxModal.getAttribute('aria-hidden') !== 'false') {
      return;
    }

    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      updateLightbox(Math.max(0, currentLightboxIndex - 1));
    } else if (event.key === 'ArrowRight') {
      updateLightbox(Math.min(lightboxImages.length - 1, currentLightboxIndex + 1));
    } else if (event.key === 'Tab') {
      const focusable = getFocusableElements();
      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}
