# Testing Guide

This project uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/react) for unit testing.

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (default)
```bash
npm test
```
Tests will automatically re-run when files change.

### Run tests with UI
```bash
npm run test:ui
```
Opens an interactive UI in your browser to view and run tests.

### Run tests with coverage
```bash
npm run test:coverage
```
Generates a coverage report showing which parts of your code are tested.

## Writing Tests

### Test File Naming
- Test files should be named `*.test.js` or `*.test.jsx`
- Place test files next to the files they test, or in a `__tests__` directory

### Example Test Structure

```javascript
import { describe, it, expect } from 'vitest';
import { myFunction } from './myModule';

describe('myFunction', () => {
  it('should do something', () => {
    expect(myFunction()).toBe(expectedValue);
  });
});
```

### Testing React Components

```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Test Examples

The following test files are included as examples:
- `src/utils/permissions.test.js` - Testing utility functions
- `src/utils/helpers.test.js` - Testing helper functions
- `src/components/AppShell.test.jsx` - Testing React components

## Best Practices

1. **Test behavior, not implementation** - Focus on what the component/function does, not how it does it
2. **Use descriptive test names** - Test names should clearly describe what is being tested
3. **Keep tests isolated** - Each test should be independent and not rely on other tests
4. **Mock external dependencies** - Mock Firebase, API calls, and other external services
5. **Test edge cases** - Include tests for null, undefined, empty values, etc.

## Mocking

### Mocking Contexts
```javascript
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));
```

### Mocking Modules
```javascript
vi.mock('../utils/permissions', () => ({
  canCreateDraft: vi.fn(),
}));
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Documentation](https://testing-library.com/react)
- [Testing Library Jest DOM Matchers](https://github.com/testing-library/jest-dom)

