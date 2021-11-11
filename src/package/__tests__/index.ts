import {jest, describe, it, expect} from '@jest/globals';

const spy = jest.fn(() => ({}));
jest.unstable_mockModule('lightweight-charts', async () => ({ createChart: spy }));

describe('Chart action', () => {
  it('should call "createChart"', async () => {
    const {chart} = await import('..');
    chart(document.createElement('div'), {});
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
