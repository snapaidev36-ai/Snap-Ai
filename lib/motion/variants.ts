export const pageContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

export const sectionContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export const slideDown = {
  hidden: { opacity: 0, y: -8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.42, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.42, ease: [0.4, 0, 0.2, 1] as const },
  },
};
