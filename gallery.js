document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. DYNAMIC GALLERY FILTERING
     ========================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and set it on the clicked button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          item.style.display = 'block';
          // Optional fade-in animation
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });


  /* ==========================================
     2. LIGHTBOX VIEWER
     ========================================== */
  // Create Lightbox Markup dynamically
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <span class="lightbox-close">&times;</span>
    <button class="lightbox-prev" aria-label="Previous image">&#10094;</button>
    <div class="lightbox-content">
      <img class="lightbox-img" src="" alt="Expanded View" />
      <div class="lightbox-caption"></div>
    </div>
    <button class="lightbox-next" aria-label="Next image">&#10095;</button>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;
  let visibleItems = [];

  // Helper function to update visible items (matching active filter)
  const updateVisibleItems = () => {
    visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
  };

  // Open Lightbox on image click
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      updateVisibleItems();
      currentIndex = visibleItems.indexOf(item);
      showImage(currentIndex);
      lightbox.classList.add('active');
    });
  });

  // Display image and title inside Lightbox
  const showImage = (index) => {
    if (index < 0 || index >= visibleItems.length) return;
    const item = visibleItems[index];
    const img = item.querySelector('img');
    const title = item.querySelector('.overlay span')?.textContent || '';

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = title;
  };

  // Lightbox Navigation Controls
  const nextImage = () => {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    showImage(currentIndex);
  };

  const prevImage = () => {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    showImage(currentIndex);
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
  };

  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
  closeBtn.addEventListener('click', closeLightbox);

  // Close lightbox when clicking outside the image container
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

});