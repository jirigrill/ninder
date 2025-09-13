// Temporary stub to prevent build errors during Firebase removal
// TODO: Remove this file once all components are updated to use simpleAuth

export function getUserStore() {
  return {
    get user() {
      return null;
    },
    set user(value) {
      // No-op
    }
  };
}

export function getSessionStore() {
  return {
    get session() {
      return null;
    },
    set session(value) {
      // No-op
    }
  };
}

export async function login() {
  // No-op - returns empty promise
  return Promise.resolve(null);
}

export function getStore() {
  // Return empty object
  return {};
}

export const auth = null;