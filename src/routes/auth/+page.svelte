<script lang="ts">
  import { secureAuth } from '$lib/auth-secure'
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { Button } from '$lib/components/ui/button'
  import * as Card from '$lib/components/ui/card'
  
  let mode: 'login' | 'register' = 'login'
  let username = ''
  let password = ''
  let confirmPassword = ''
  let error = ''
  let loading = false
  
  onMount(() => {
    // If already logged in, redirect to main app
    if (secureAuth.isLoggedIn()) {
      goto('/')
    }
  })
  
  async function handleSubmit() {
    if (!username.trim() || !password.trim()) {
      error = 'Please fill in all fields'
      return
    }
    
    if (mode === 'register' && password !== confirmPassword) {
      error = 'Passwords do not match'
      return
    }
    
    if (mode === 'register' && password.length < 6) {
      error = 'Password must be at least 6 characters'
      return
    }
    
    loading = true
    error = ''
    
    const result = mode === 'login' 
      ? await secureAuth.login(username, password)
      : await secureAuth.register(username, password)
    
    if (result.success) {
      goto('/')
    } else {
      error = result.error || 'Authentication failed'
    }
    
    loading = false
  }
  
  function toggleMode() {
    mode = mode === 'login' ? 'register' : 'login'
    error = ''
    confirmPassword = ''
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        {mode === 'login' ? 'Welcome back to Ninder' : 'Join Ninder to start swiping baby names'}
      </p>
    </div>
    
    <Card.Root>
      <Card.Header>
        <Card.Title>{mode === 'login' ? 'Login' : 'Register'}</Card.Title>
        <Card.Description>
          {mode === 'login' 
            ? 'Enter your credentials to access your account' 
            : 'Create a secure account to save your progress'
          }
        </Card.Description>
      </Card.Header>
      
      <Card.Content>
        <form class="space-y-4" on:submit|preventDefault={handleSubmit}>
          {#if error}
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          {/if}
          
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              bind:value={username}
              placeholder="Enter username"
              class="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <p class="mt-1 text-xs text-gray-500">
              2-20 characters. Only letters, numbers, _ and - allowed.
            </p>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              bind:value={password}
              placeholder="Enter password"
              class="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {#if mode === 'register'}
              <p class="mt-1 text-xs text-gray-500">
                Minimum 6 characters required.
              </p>
            {/if}
          </div>
          
          {#if mode === 'register'}
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                bind:value={confirmPassword}
                placeholder="Confirm password"
                class="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          {/if}
          
          <Button
            type="submit"
            disabled={loading}
            class="w-full"
          >
            {#if loading}
              <i class="fa-solid fa-circle-notch fa-spin mr-2"></i>
            {/if}
            {loading 
              ? (mode === 'login' ? 'Signing in...' : 'Creating account...') 
              : (mode === 'login' ? 'Sign in' : 'Create account')
            }
          </Button>
        </form>
      </Card.Content>
      
      <Card.Footer>
        <div class="text-center">
          <button
            type="button"
            class="text-sm text-indigo-600 hover:text-indigo-500"
            on:click={toggleMode}
          >
            {mode === 'login' 
              ? "Don't have an account? Sign up" 
              : 'Already have an account? Sign in'
            }
          </button>
        </div>
      </Card.Footer>
    </Card.Root>
  </div>
</div>