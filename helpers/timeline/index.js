import gsap from 'gsap';

/**
 * Bind an origin Draggable position to a target Draggable position
 * @param {HTMLElement} originElement
 * @param {HTMLElement} targetElement
 * @param {number} originStepSize
 * @param {number} targetStepSize
 * @param {number} value
 */
export const bindDraggable = (
  originElement,
  targetElement,
  originStepSize,
  targetStepSize,
  value
) => {
  gsap.set(targetElement, {
    x: gsap.utils.mapRange(
      originElement.clientWidth * -1 + originStepSize,
      0,
      targetElement.clientWidth * -1 + targetStepSize,
      0,
      value
    ),
  });
};
