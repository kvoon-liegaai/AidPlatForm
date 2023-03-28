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
import { useStorage } from '@vueuse/core';
import { BehaviorSubject } from 'rxjs';
import { fromFetch } from 'rxjs/fetch'
import { tap, map, mergeMap } from 'rxjs/operators';

interface LoginResponse {
  token: string;
}

export class AuthService {
  public loggedIn: BehaviorSubject<boolean>

  constructor() {
    this.loggedIn = new BehaviorSubject(false);
  }

  login(username: string, password: string) {
    return fromFetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
      .pipe(
        mergeMap(response => {
          console.log('response', response)
          if (!response.ok) {
            throw new Error('Login failed');
          }
          else if (response.status === 204) {
            throw new Error('not find user')
          }
          return response.json();
        }),
        tap(response => {
          const access_token = useStorage('access_token', null)
          access_token.value = response.access_token
          console.log('access_token', access_token.value)
          this.loggedIn.next(true);
        }),
        map(() => true)
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  getToken() {
    return localStorage.getItem('token');
  }
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
