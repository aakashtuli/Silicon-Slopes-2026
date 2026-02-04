document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slideCounter = document.getElementById('slideCounter');
    const progressBar = document.getElementById('progressBar');

    let currentSlide = 0;
    const totalSlides = slides.length;

    // Initialize logic
    function init() {
        // Check URL params for initial slide
        const urlParams = new URLSearchParams(window.location.search);
        const slideParam = parseInt(urlParams.get('slide'));

        if (!isNaN(slideParam) && slideParam > 0 && slideParam <= totalSlides) {
            updateSlide(slideParam - 1, false); // Don't push state on initial load if present
        } else {
            updateSlide(0, false);
        }
    }

    function updateSlide(index, pushState = true) {
        // Bounds logic
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;

        currentSlide = index;

        // Update active classes
        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update active status on counter/progress
        if (slideCounter) {
            slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
        }

        if (progressBar) {
            const progress = ((currentSlide + 1) / totalSlides) * 100;
            progressBar.style.width = `${progress}%`;
        }

        // History API
        if (pushState) {
            const url = new URL(window.location);
            url.searchParams.set('slide', currentSlide + 1);
            window.history.pushState({ slide: currentSlide }, '', url);
        }
    }

    // Event Listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
            this.blur();
            navigatePrev();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
            this.blur();
            navigateNext();
        });
    }

    function navigateNext() {
        const activeSlide = slides[currentSlide];
        const nextHiddenFragment = activeSlide.querySelector('.fragment.hidden');

        if (nextHiddenFragment) {
            nextHiddenFragment.classList.remove('hidden');
        } else {
            updateSlide(currentSlide + 1);
        }
    }

    function navigatePrev() {
        const activeSlide = slides[currentSlide];
        const visibleFragments = activeSlide.querySelectorAll('.fragment:not(.hidden)');

        if (visibleFragments.length > 0) {
            // Hide the last visible fragment
            visibleFragments[visibleFragments.length - 1].classList.add('hidden');
        } else {
            updateSlide(currentSlide - 1);
        }
    }

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        // Prevent default scrolling for arrow keys/space
        if (['ArrowRight', 'ArrowLeft', 'Space', ' '].includes(e.key)) {
            // e.preventDefault(); // Optional
        }

        switch (e.key) {
            case 'ArrowRight':
            case ' ':
            case 'Space': // Older browsers
            case 'Enter':
                navigateNext();
                break;
            case 'ArrowLeft':
            case 'Backspace':
                navigatePrev();
                break;
        }
    });

    // Browser Back Button Support
    window.addEventListener('popstate', (e) => {
        if (e.state && typeof e.state.slide === 'number') {
            updateSlide(e.state.slide, false); // Don't push state again
        } else {
            // Default to 0 if no state (e.g. back to start)
            updateSlide(0, false);
        }
    });

    init();
});
