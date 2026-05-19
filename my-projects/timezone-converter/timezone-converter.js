// TIMELINE AUTO ALIGN
const timelineScrolls = document.querySelectorAll('.timeline-scroll');
function centerActiveCells() {
  timelineScrolls.forEach((timeline) => {
    const activeCell = timeline.querySelector('.active-cell');
    if (!activeCell) return;

    const timelineWidth = timeline.offsetWidth;
    const activeOffset = activeCell.offsetLeft;
    const activeWidth = activeCell.offsetWidth;
    const scrollPosition = activeOffset - (timelineWidth / 2) + (activeWidth / 2);

    timeline.scrollLeft = scrollPosition;
  });
}

// SYNCHRONIZED SCROLLING
let isSyncingScroll = false;
timelineScrolls.forEach((timeline) => {
  timeline.addEventListener('scroll', () => {
    if (isSyncingScroll) return;
    isSyncingScroll = true;

    const scrollLeft = timeline.scrollLeft;
    timelineScrolls.forEach((otherTimeline) => {
      if (otherTimeline !== timeline) {
        otherTimeline.scrollLeft = scrollLeft;
      }
    });

    isSyncingScroll = false;
  });
});

// INITIALIZE
window.addEventListener('load', () => {
  centerActiveCells();
});