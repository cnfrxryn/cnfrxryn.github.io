// TIMELINE ELEMENTS
const timelineScrolls = document.querySelectorAll('.timeline-scroll');
const syncScrollToggle = document.querySelector('#sync-scroll-toggle');

// CENTER ACTIVE CELLS
function centerActiveCells() {
  timelineScrolls.forEach((timeline) => {
    const activeCell = timeline.querySelector('.active-cell');
    if (!activeCell) return;

    const timelineWidth = timeline.clientWidth;
    const activeOffset = activeCell.offsetLeft + (activeCell.clientWidth / 2);
    const scrollPosition = activeOffset - (timelineWidth / 2);

    timeline.scrollLeft = scrollPosition;
  });
}

// SYNCHRONIZED SCROLLING
let isSyncingScroll = false;
timelineScrolls.forEach((timeline) => {
  timeline.addEventListener('scroll', () => {
    // STOP IF TOGGLE IS OFF
    if (!syncScrollToggle.checked) return;
    if (isSyncingScroll) return;
    isSyncingScroll = true;

    const currentScrollLeft = timeline.scrollLeft;
    timelineScrolls.forEach((otherTimeline) => {
      if (otherTimeline !== timeline) {
        otherTimeline.scrollLeft = currentScrollLeft;
      }
    });

    requestAnimationFrame(() => {
      isSyncingScroll = false;
    });
  });
});

//INITIALIZE
window.addEventListener('load', () => {
  setTimeout(() => {
    centerActiveCells();
  }, 100);
});