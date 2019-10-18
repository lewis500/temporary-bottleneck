export const total = 400;

export const vf1 = (100 * 1000) / 3600; /* 60 mph to m/s */
export const qc1 = 4200 / 3600;
export const kj1 = 100 / 1000;
export const sj1 = 1 / kj1;
export const kc1 = qc1 / vf1;
export const w1 = qc1 / (kj1 - kc1);

export const vf2 = (60 * 1000) / 3600;
export const kc2 = kc1 * 0.6;
export const kj2 = kj1*0.95;
export const sj2 = 1 / kj2;
export const qc2 = kc2 * vf2;
export const w2 = qc2 / (kj2 - kc2);

export const carLength = 3;
export const carHeight = 2;
export const roadWidth = 10;
export const delta = 0.1;

export const duration = 100;
export const blockTimes = [15,50];

export const blockX = 350;
export const Q = qc1 * 0.7;
