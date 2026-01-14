import { getDebugEnabled, logger, setDebugEnabled } from './logger';

describe('logger', () => {
  beforeEach(() => {
    setDebugEnabled(false);
    jest.spyOn(console, 'debug').mockImplementation(() => undefined);
    jest.spyOn(console, 'info').mockImplementation(() => undefined);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    setDebugEnabled(false);
  });

  it('does not log debug messages when disabled', () => {
    logger.debug('Hidden');

    expect(console.debug).not.toHaveBeenCalled();
  });

  it('logs debug messages when enabled', () => {
    setDebugEnabled(true);

    logger.debug('Visible');

    expect(getDebugEnabled()).toBe(true);
    expect(console.debug).toHaveBeenCalledWith('Visible');
  });

  it('logs info with context payloads', () => {
    logger.info('Hello', { scope: 'tests' });

    expect(console.info).toHaveBeenCalledWith('Hello', { scope: 'tests' });
  });
});
