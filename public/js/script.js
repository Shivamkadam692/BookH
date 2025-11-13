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
  if (!checkInInput || !checkOutInput) {
    return;
  }

  const today = new Date();
  const isoToday = today.toISOString().split('T')[0];
  checkInInput.min = isoToday;
  checkOutInput.min = isoToday;

  const updateCheckoutMin = () => {
    if (!checkInInput.value) {
      checkOutInput.min = isoToday;
      return;
    }
    const checkInDate = new Date(checkInInput.value);
    const nextDay = new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000);
    const isoNextDay = nextDay.toISOString().split('T')[0];
    checkOutInput.min = isoNextDay;
    if (checkOutInput.value && checkOutInput.value < isoNextDay) {
      checkOutInput.value = isoNextDay;
    }
  };

  checkInInput.addEventListener('change', updateCheckoutMin);
  updateCheckoutMin();
};

document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  initBookingForm();
});