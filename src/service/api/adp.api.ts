// <template>
//   <form @submit.prevent="login">
//     <label>
//       Username:
//       <input type="text" v-model="username">
//     </label>
//     <label>
//       Password:
//       <input type="password" v-model="password">
//     </label>
//     <button type="submit">Log in</button>
//   </form>
// </template>

// <script>
// import { ref } from 'vue';
import type { Observable } from 'rxjs'
import { mergeMap } from 'rxjs'
import { fromFetch } from 'rxjs/fetch'

interface LoginResponse {
  access_token: string
}

export function login(username: string, password: string): Observable<LoginResponse> {
  return fromFetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .pipe(
      mergeMap((response) => {
        console.log('response', response)
        if (!response.ok)
          throw new Error('Login failed')

        else if (response.status === 204)
          throw new Error('not find user')

        return response.json()
      }),
    )
}

// export default {
//   setup() {
//     const authService = new AuthService();
//     const username = ref('');
//     const password = ref('');

//     const login = () => {
//       authService.login(username.value, password.value)
//         .subscribe({
//           error: () => {
//             alert('Login failed');
//           }
//         });
//     };

//     return {
//       username,
//       password,
//       loggedIn: authService.isLoggedIn(),
//       login
//     };
//   }
// };
// </script>
