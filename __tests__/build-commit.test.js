const buildCommit = require('../lib/build-commit');

describe('buildCommit()', () => {
  const answers = {
    type: 'feat',
    scope: 'app',
    subject: 'this is a new feature',
  };

  it('subject with default subject separator', () => {
    const options = {};
    expect(buildCommit(answers, options)).toEqual('feat(app): this is a new feature');
  });

  it('subject with custom subject separator option', () => {
    const options = {
      subjectSeparator: ' - ',
    };
    expect(buildCommit(answers, options)).toEqual('feat(app) - this is a new feature');
  });

  it('subject 1 empty character separator', () => {
    const options = {
      subjectSeparator: ' ',
    };
    expect(buildCommit(answers, options)).toEqual('feat(app) this is a new feature');
  });

  describe('without scope', () => {
    it('subject without scope', () => {
      const answersNoScope = {
        type: 'feat',
        subject: 'this is a new feature',
      };
      const options = {};
      expect(buildCommit(answersNoScope, options)).toEqual('feat: this is a new feature');
    });

    it('subject without scope', () => {
      const answersNoScope = {
        type: 'feat',
        subject: 'this is a new feature',
      };
      const options = {
        subjectSeparator: ' - ',
      };
      expect(buildCommit(answersNoScope, options)).toEqual('feat - this is a new feature');
    });
  });

  describe('ticket number', () => {
    it('subject with ticket number', () => {
      const answersNoScope = {
        type: 'feat',
        subject: 'this is a new feature',
        ticketNumber: '123',
      };
      const options = {};
      expect(buildCommit(answersNoScope, options)).toEqual('feat: 123 this is a new feature');
    });

    it('subject with ticket number prefix but no scope', () => {
      const answersNoScope = {
        type: 'feat',
        subject: 'this is a new feature',
        ticketNumber: '123',
      };
      const options = {
        ticketNumberPrefix: 'PREFIX-',
      };
      expect(buildCommit(answersNoScope, options)).toEqual('feat: PREFIX-123 this is a new feature');
    });

    it('subject with scope, ticket number and prefix', () => {
      const answersNoScope = {
        type: 'feat',
        scope: 'app',
        subject: 'this is a new feature',
        ticketNumber: '123',
      };
      const options = {
        ticketNumberPrefix: 'PREFIX-',
      };
      expect(buildCommit(answersNoScope, options)).toEqual('feat(app): PREFIX-123 this is a new feature');
    });

    it('subject with no ticket number or scope but with fallback', () => {
      const answersNoScope = {
        type: 'feat',
        subject: 'this is a new feature',
      };
      const options = {
        fallbackTicketNumber: '000',
      };
      expect(buildCommit(answersNoScope, options)).toEqual('feat: 000 this is a new feature');
    });

    it('subject with prefix and fallback ticket number', () => {
      const answersNoScope = {
        type: 'feat',
        subject: 'this is a new feature',
      };
      const options = {
        ticketNumberPrefix: 'PREFIX-',
        fallbackTicketNumber: '000',
      };
      expect(buildCommit(answersNoScope, options)).toEqual('feat: PREFIX-000 this is a new feature');
    });

    it('subject with ticket number and fallback', () => {
      const answersNoScope = {
        type: 'feat',
        subject: 'should not use fallback',
        ticketNumber: '123',
      };
      const options = {
        fallbackTicketNumber: '000',
      };
      expect(buildCommit(answersNoScope, options)).toEqual('feat: 123 should not use fallback');
    });
  });

  describe('type prefix and type suffix', () => {
    it('subject with both', () => {
      const answersNoScope = {
        type: 'feat',
        subject: 'this is a new feature',
      };
      const options = {
        typePrefix: '[',
        typeSuffix: ']',
        subjectSeparator: ' ',
      };
      expect(buildCommit(answersNoScope, options)).toEqual('[feat] this is a new feature');
    });
  });

  describe('pipe replaced with new line', () => {
    // I know it looks weird on tests but this proves to have the correct breakline inserted.
    const expecteMessage = `feat: this is a new feature\n
body with new line now
body line2

ISSUES CLOSED: footer with new line
line 2`;

    it('should add breakline for body and footer', () => {
      const answersNoScope = {
        type: 'feat',
        subject: 'this is a new feature',
        body: 'body with new line now|body line2',
        footer: 'footer with new line|line 2',
      };
      const options = {};

      expect(buildCommit(answersNoScope, options)).toEqual(expecteMessage);
    });

    it('should override breakline character with option breaklineChar', () => {
      const answersNoScope = {
        type: 'feat',
        subject: 'this is a new feature',
        body: 'body with new line now@@@body line2',
        footer: 'footer with new line@@@line 2',
      };
      const options = {
        breaklineChar: '@@@',
      };

      expect(buildCommit(answersNoScope, options)).toEqual(expecteMessage);
    });
  });

  describe('with ticketNumberSuffix', () => {
    it('should be visible', () => {
      const answersTicketNumberSuffix = {
        ...answers,
        ticketNumber: '12345',
      };
      const options = {
        allowTicketNumber: true,
        ticketNumberSuffix: '@@@ ',
      };

      expect(buildCommit(answersTicketNumberSuffix, options)).toEqual('feat(app): 12345@@@ this is a new feature');
    });
  });

  describe('with ticketNumberPosition', () => {
    it('should be same', () => {
      const answersTicketNumberSuffix = {
        ...answers,
        ticketNumber: '12345',
      };
      const options = {
        allowTicketNumber: true,
        ticketNumberPosition: 'standard',
      };

      expect(buildCommit(answersTicketNumberSuffix, options)).toEqual('feat(app): 12345 this is a new feature');
    });

    it('should be "first"', () => {
      const answersTicketNumberSuffix = {
        ...answers,
        ticketNumber: '12345',
      };
      const options = {
        allowTicketNumber: true,
        ticketNumberPosition: 'first',
      };

      expect(buildCommit(answersTicketNumberSuffix, options)).toEqual('12345 feat(app): this is a new feature');
    });

    it('should be "last"', () => {
      const answersTicketNumberSuffix = {
        ...answers,
        ticketNumber: '12345',
      };
      const options = {
        allowTicketNumber: true,
        ticketNumberPrefix: ' ',
        ticketNumberSuffix: '',
        ticketNumberPosition: 'last',
      };

      expect(buildCommit(answersTicketNumberSuffix, options)).toEqual('feat(app): this is a new feature 12345');
    });
  });
});
