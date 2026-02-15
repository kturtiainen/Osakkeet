import { describe, it, expect, vi } from 'vitest';
import { logger } from '../utils/logger';

describe('logger', () => {
  it('should have error method', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    logger.error('test error', { context: 'test' });
    
    expect(errorSpy).toHaveBeenCalledWith('[ERROR] test error', { context: 'test' });
    errorSpy.mockRestore();
  });

  it('should have warn method', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    logger.warn('test warning', { context: 'test' });
    
    expect(warnSpy).toHaveBeenCalledWith('[WARN] test warning', { context: 'test' });
    warnSpy.mockRestore();
  });

  it('should have info method', () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    
    logger.info('test info', { context: 'test' });
    
    expect(infoSpy).toHaveBeenCalledWith('[INFO] test info', { context: 'test' });
    infoSpy.mockRestore();
  });

  it('should work without context', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    logger.error('test error');
    
    expect(errorSpy).toHaveBeenCalledWith('[ERROR] test error', undefined);
    errorSpy.mockRestore();
  });
});
