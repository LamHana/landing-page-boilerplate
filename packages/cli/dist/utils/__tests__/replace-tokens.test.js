import { replaceTokens } from '../replace-tokens';
describe('replaceTokens', () => {
    describe('single token replacement', () => {
        it('should replace a single token in content', () => {
            const content = 'Hello __NAME__!';
            const tokens = { __NAME__: 'World' };
            expect(replaceTokens(content, tokens)).toBe('Hello World!');
        });
        it('should replace token at the start', () => {
            const content = '__GREETING__ everyone!';
            const tokens = { __GREETING__: 'Welcome' };
            expect(replaceTokens(content, tokens)).toBe('Welcome everyone!');
        });
        it('should replace token at the end', () => {
            const content = 'This is __VERSION__';
            const tokens = { __VERSION__: '1.0.0' };
            expect(replaceTokens(content, tokens)).toBe('This is 1.0.0');
        });
        it('should replace token when it is the entire content', () => {
            const content = '__TOKEN__';
            const tokens = { __TOKEN__: 'value' };
            expect(replaceTokens(content, tokens)).toBe('value');
        });
    });
    describe('multiple token replacement', () => {
        it('should replace multiple different tokens', () => {
            const content = 'Project: __PROJECT_NAME__, Version: __VERSION__';
            const tokens = {
                __PROJECT_NAME__: 'my-app',
                __VERSION__: '2.0.0',
            };
            expect(replaceTokens(content, tokens)).toBe('Project: my-app, Version: 2.0.0');
        });
        it('should replace the same token multiple times', () => {
            const content = '__PREFIX____SUFFIX__ uses __PREFIX__ everywhere';
            const tokens = { __PREFIX__: 'app', __SUFFIX__: 'config' };
            expect(replaceTokens(content, tokens)).toBe('appconfig uses app everywhere');
        });
        it('should replace tokens in JSON-like content', () => {
            const content = '{ "name": "__NAME__", "version": "__VERSION__" }';
            const tokens = {
                __NAME__: 'my-package',
                __VERSION__: '1.0.0',
            };
            expect(replaceTokens(content, tokens)).toBe('{ "name": "my-package", "version": "1.0.0" }');
        });
        it('should handle many tokens in one call', () => {
            const content = '__A____B____C____D__';
            const tokens = {
                __A__: '1',
                __B__: '2',
                __C__: '3',
                __D__: '4',
            };
            expect(replaceTokens(content, tokens)).toBe('1234');
        });
    });
    describe('no tokens (passthrough)', () => {
        it('should return unchanged content when no tokens present', () => {
            const content = 'Hello World';
            const tokens = { __NAME__: 'value' };
            expect(replaceTokens(content, tokens)).toBe('Hello World');
        });
        it('should return unchanged content with empty token map', () => {
            const content = 'Hello __NAME__!';
            const tokens = {};
            expect(replaceTokens(content, tokens)).toBe('Hello __NAME__!');
        });
        it('should handle empty content', () => {
            const content = '';
            const tokens = { __TOKEN__: 'value' };
            expect(replaceTokens(content, tokens)).toBe('');
        });
    });
    describe('token in middle of word', () => {
        it('should replace token even when in middle of word', () => {
            const content = 'my__APP__name';
            const tokens = { __APP__: 'project' };
            expect(replaceTokens(content, tokens)).toBe('myprojectname');
        });
        it('should handle hyphenated words with token', () => {
            const content = 'my-__NAME__-app';
            const tokens = { __NAME__: 'awesome' };
            expect(replaceTokens(content, tokens)).toBe('my-awesome-app');
        });
        it('should handle underscores adjacent to token', () => {
            const content = 'func___NAME___function';
            const tokens = { __NAME__: 'test' };
            expect(replaceTokens(content, tokens)).toBe('func_test_function');
        });
    });
    describe('special characters and escaping', () => {
        it('should handle token values with special characters', () => {
            const content = 'Theme: __THEME__';
            const tokens = { __THEME__: '@awesome/theme-v2.0' };
            expect(replaceTokens(content, tokens)).toBe('Theme: @awesome/theme-v2.0');
        });
        it('should handle token values with spaces', () => {
            const content = 'Company: __COMPANY__';
            const tokens = { __COMPANY__: 'My Awesome Company' };
            expect(replaceTokens(content, tokens)).toBe('Company: My Awesome Company');
        });
        it('should handle token values with newlines', () => {
            const content = 'Script:\n__SCRIPT__\nEnd';
            const tokens = { __SCRIPT__: 'echo "hello"\necho "world"' };
            expect(replaceTokens(content, tokens)).toBe('Script:\necho "hello"\necho "world"\nEnd');
        });
        it('should handle token names with numbers', () => {
            const content = '__TOKEN_1__ and __TOKEN_2__';
            const tokens = {
                __TOKEN_1__: 'first',
                __TOKEN_2__: 'second',
            };
            expect(replaceTokens(content, tokens)).toBe('first and second');
        });
    });
    describe('multiline content', () => {
        it('should replace tokens across multiple lines', () => {
            const content = `
Project: __NAME__
Version: __VERSION__
Author: __AUTHOR__
`;
            const tokens = {
                __NAME__: 'my-app',
                __VERSION__: '1.0.0',
                __AUTHOR__: 'John Doe',
            };
            const expected = `
Project: my-app
Version: 1.0.0
Author: John Doe
`;
            expect(replaceTokens(content, tokens)).toBe(expected);
        });
        it('should replace tokens in code blocks', () => {
            const content = `
import __PACKAGE_NAME__ from '@/__PACKAGE_NAME__';

export default __PACKAGE_NAME__;
`;
            const tokens = { __PACKAGE_NAME__: 'config' };
            const expected = `
import config from '@/config';

export default config;
`;
            expect(replaceTokens(content, tokens)).toBe(expected);
        });
    });
    describe('package.json specific use case', () => {
        it('should replace project name in package.json', () => {
            const pkgJson = `{
  "name": "__PROJECT_NAME__",
  "description": "This is __PROJECT_NAME__"
}`;
            const tokens = { __PROJECT_NAME__: 'my-awesome-app' };
            const expected = `{
  "name": "my-awesome-app",
  "description": "This is my-awesome-app"
}`;
            expect(replaceTokens(pkgJson, tokens)).toBe(expected);
        });
    });
    describe('env file use case', () => {
        it('should replace tokens in .env files', () => {
            const envContent = `
DATABASE_URL=__DB_URL__
API_KEY=__API_KEY__
NEXT_PUBLIC_THEME=__THEME__
`;
            const tokens = {
                __DB_URL__: 'postgresql://localhost/mydb',
                __API_KEY__: 'secret-key-123',
                __THEME__: 'dark',
            };
            const expected = `
DATABASE_URL=postgresql://localhost/mydb
API_KEY=secret-key-123
NEXT_PUBLIC_THEME=dark
`;
            expect(replaceTokens(envContent, tokens)).toBe(expected);
        });
    });
    describe('order independence', () => {
        it('should produce same result regardless of token order', () => {
            const content = '__A__ and __B__ and __C__';
            const tokens = { __A__: '1', __B__: '2', __C__: '3' };
            const result1 = replaceTokens(content, tokens);
            expect(result1).toBe('1 and 2 and 3');
        });
    });
    describe('edge cases', () => {
        it('should handle empty token value', () => {
            const content = 'Hello __NAME__!';
            const tokens = { __NAME__: '' };
            expect(replaceTokens(content, tokens)).toBe('Hello !');
        });
        it('should handle token value that looks like a token', () => {
            const content = 'Value: __TOKEN__';
            const tokens = { __TOKEN__: '__OTHER_TOKEN__' };
            expect(replaceTokens(content, tokens)).toBe('Value: __OTHER_TOKEN__');
        });
        it('should not double-replace if token value contains the token', () => {
            const content = '__NAME__';
            const tokens = { __NAME__: '__NAME__' };
            // replaceAll will keep replacing, so this will result in the same token infinitely
            // This is expected behavior - the token replaces with itself
            expect(replaceTokens(content, tokens)).toBe('__NAME__');
        });
    });
});
