(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

const initFilters = () => {
  const filterList = document.querySelector('[data-filter-list]');
  if (!filterList) {
    return;
  }

  const filterButtons = Array.from(filterList.querySelectorAll('[data-filter-value]'));
  const listingCards = Array.from(document.querySelectorAll('[data-listing-card]'));
  const emptyState = document.querySelector('[data-filter-empty]');
  const validFilters = new Set(filterButtons.map((button) => button.dataset.filterValue));
  validFilters.add('All');

  const setActiveFilter = (targetValue) => {
    filterButtons.forEach((button) => {
      const isActive = button.dataset.filterValue === targetValue
        || (!button.dataset.filterValue && targetValue === 'All');
      if (isActive) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  };

  const updateUrl = (targetValue) => {
    const url = new URL(window.location.href);
    if (targetValue && targetValue !== 'All') {
      url.searchParams.set('category', targetValue);
    } else {
      url.searchParams.delete('category');
    }
    window.history.replaceState({}, '', url.toString());
  };

  const toggleEmptyState = (shouldShow) => {
    if (!emptyState) {
      return;
    }
    if (shouldShow) {
      emptyState.classList.remove('d-none');
    } else {
      emptyState.classList.add('d-none');
    }
  };

  const applyFilter = (targetValue) => {
    const normalizedValue = validFilters.has(targetValue) ? targetValue : 'All';

    let visibleCount = 0;
    listingCards.forEach((card) => {
      const cardCategory = card.dataset.category || 'All';
      const shouldShow = normalizedValue === 'All' || cardCategory === normalizedValue;
      if (shouldShow) {
        card.classList.remove('d-none');
        visibleCount += 1;
      } else {
        card.classList.add('d-none');
      }
    });

    setActiveFilter(normalizedValue);
    toggleEmptyState(visibleCount === 0);
    updateUrl(normalizedValue);
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const { filterValue } = button.dataset;
      applyFilter(filterValue || 'All');
    });
  });

  const initialCategory = new URL(window.location.href).searchParams.get('category');
  applyFilter(initialCategory || 'All');
};

const initBookingForm = () => {
  const checkInInput = document.querySelector('[data-booking-checkin]');
  const checkOutInput = document.querySelector('[data-booking-checkout]');
  const nightsDisplay = document.getElementById('nights-display');
  const totalPriceDisplay = document.getElementById('total-price');
  
  if (!checkInInput || !checkOutInput || !nightsDisplay || !totalPriceDisplay) {
    return;
  }

  const pricePerNight = parseFloat(
    totalPriceDisplay.textContent.replace(/[₹,\s]/g, '').trim()
  ) || 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isoToday = today.toISOString().split('T')[0];
  
  checkInInput.min = isoToday;
  checkOutInput.min = isoToday;

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end - start;
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  };

  const updatePrice = () => {
    const checkIn = checkInInput.value;
    const checkOut = checkOutInput.value;
    const nights = calculateNights(checkIn, checkOut);
    
    if (nights > 0 && pricePerNight > 0) {
      nightsDisplay.textContent = `${nights} night${nights === 1 ? '' : 's'}`;
      const total = nights * pricePerNight;
      totalPriceDisplay.textContent = `₹ ${total.toLocaleString('en-IN')}`;
    } else {
      nightsDisplay.textContent = '-';
      totalPriceDisplay.textContent = `₹ ${pricePerNight.toLocaleString('en-IN')}`;
    }
  };

  const updateCheckoutMin = () => {
    if (!checkInInput.value) {
      checkOutInput.min = isoToday;
      updatePrice();
      return;
    }
    const checkInDate = new Date(checkInInput.value);
    checkInDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(checkInDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const isoNextDay = nextDay.toISOString().split('T')[0];
    
    checkOutInput.min = isoNextDay;
    if (checkOutInput.value && checkOutInput.value < isoNextDay) {
      checkOutInput.value = isoNextDay;
    }
    updatePrice();
  };

  checkInInput.addEventListener('change', () => {
    updateCheckoutMin();
    updatePrice();
  });
  
  checkOutInput.addEventListener('change', updatePrice);
  
  updateCheckoutMin();
  updatePrice();
};

document.addEventListener('DOMContentLoaded', () => {
  const filterList = document.querySelector('[data-filter-list]');
  if (filterList) {
    initFilters();
  }
  
  const bookingForm = document.querySelector('.booking-form');
  if (bookingForm) {
    initBookingForm();
  }
});