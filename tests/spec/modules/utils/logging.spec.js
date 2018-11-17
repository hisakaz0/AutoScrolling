import { logger } from '../../../../src/modules/utils/logging';

describe('logger module:', () => {
  describe('error:', () => {
    logger.error('tag', 'output');
  });
});
