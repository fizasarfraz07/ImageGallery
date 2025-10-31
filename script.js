// Image Gallery script
document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const gallery = document.getElementById('gallery');
  const items = Array.from(gallery.querySelectorAll('.item'));
  const searchInput = document.getElementById('search');

  // Lightbox elements
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox.querySelector('img');
  const lbCaption = lightbox.querySelector('figcaption');
  const closeBtn = lightbox.querySelector('.close');
  const prevBtn = lightbox.querySelector('.prev');
  const nextBtn = lightbox.querySelector('.next');

  let currentIndex = -1;
  function openLightbox(index) {
    const item = items[index];
    if (!item) return;
    const img = item.querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = item.querySelector('.meta').textContent || img.alt;
    lightbox.setAttribute('aria-hidden', 'false');
    currentIndex = index;
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function showNext() { openLightbox((currentIndex + 1) % items.length); }
  function showPrev() { openLightbox((currentIndex - 1 + items.length) % items.length); }

  // Click an item to open
  items.forEach((it, idx) => {
    it.addEventListener('click', () => openLightbox(idx));
  });

  // Lightbox controls
  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (lightbox.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    }
  });

  // Filtering
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      applyFilter(filter, searchInput.value.trim().toLowerCase());
    });
  });

  function applyFilter(category = 'all', query = '') {
    items.forEach(item => {
      const cat = item.dataset.category || '';
      const text = (item.querySelector('img').alt || '').toLowerCase();
      const matchesCategory = (category === 'all' || cat === category);
      const matchesQuery = text.includes(query);
      if (matchesCategory && matchesQuery) {
        item.style.display = ''; // show
        // nice fade-in
        item.animate([{opacity:0, transform: 'translateY(12px)'}, {opacity:1, transform:'translateY(0)'}], {duration:320, easing:'cubic-bezier(.2,.9,.3,1)'});
      } else {
        // hide with small animation
        item.style.display = 'none';
      }
    });
  }

  // Search
  searchInput.addEventListener('input', () => {
    const active = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    applyFilter(active, searchInput.value.trim().toLowerCase());
  });

  // init
  applyFilter('all','');
});