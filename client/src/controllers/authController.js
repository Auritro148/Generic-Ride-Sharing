const API_URL = 'http://localhost:3000'

export const signIn = async (credentials) => {
  const response = await fetch(`${API_URL}/api/auth/signin`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Sign in failed'
    )
  }

  return data
}