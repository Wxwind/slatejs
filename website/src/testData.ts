import { TimelineRow } from 'animation-timeline-js';

export const rows: TimelineRow[] = [
  {
    keyframes: [
      {
        val: 40,
      },
      {
        val: 3000,
        selected: false,
      },
    ],
  },
  {
    hidden: false,
    keyframes: [
      {
        val: 2000,
      },
      {
        val: 2500,
      },
      {
        val: 3600,
      },
    ],
  },
  {
    hidden: false,
    keyframes: [
      {
        val: 1000,
      },
      {
        val: 1500,
      },
      {
        val: 2000,
      },
    ],
  },
  {
    keyframes: [
      {
        val: 40,
        max: 850,
        group: 'a',
      },
      {
        val: 800,
        max: 900,
        group: 'a',
      },
      {
        min: 1000,
        max: 3400,
        val: 1900,
        group: 'b',
      },
      {
        val: 3000,
        max: 3500,
        group: 'b',
      },
      {
        min: 3500,
        val: 4000,
        group: 'c',
      },
    ],
  },
  {
    keyframes: [
      {
        val: 100,
      },
      {
        val: 3410,
      },
      {
        val: 2000,
      },
    ],
  },
  {
    keyframes: [
      {
        val: 90,
      },
      {
        val: 3000,
      },
    ],
  },
  {},
  {
    max: 4000,
    keyframes: [
      {
        group: 'block',

        val: 4000,
        selectable: false,
        draggable: false,
      },
      {
        val: 1500,
      },
      {
        val: 2500,
      },
    ],
  },
  {},
  {},
  {},
  {},
  {},
  {},
  {},
];
