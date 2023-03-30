<script setup lang="ts">
import { useSubscription } from '@vueuse/rxjs'
import { QForm } from 'quasar'
import { AuthService } from 'src/service/auth.service'

const router = useRouter()
const authService = AuthService.getInstance()

if (authService) {
  useSubscription(
    authService.isLoggedIn()
      .subscribe((val) => {
        if (val)
          router.push('/home')
      }),
  )
}

// login sign up controller

const tab = ref<'login' | 'signup'>('login')

function onFormReset(form: QForm | undefined) {
  console.log('reset')
  if (!form)
    throw new Error('form not found')
  form.resetValidation()
}

// login

const loginFormRef = ref<QForm | undefined>()
const loginForm = reactive({
  username: '',
  password: '',
  accept: false,
})

const onLoginSubmit = () => {
  console.log('提交表单 login in')
  if (authService) {
    useSubscription(
      authService.loginAndSetToken(loginForm.username, loginForm.password)
        .subscribe({
          next: console.log,
          error: () => {
            alert('Login failed')
          },
        }),
    )
  }
}

// sign up

const signupFormRef = ref<QForm | undefined>()

const signupForm = reactive({
  email: '',
  username: '',
  password: '',
  password2: '',
})

function onSignupSubmit() {
  console.log('提交表单 sign up')
  alert('注册成功')
}
</script>

<template>
  <div h-screen container mx-auto p-10>
    <div class="login-wrapper" flex flex-col>
      <section class="logo" mx-auto>
        <q-avatar square mr-2>
          <img src="src/assets/smile.svg">
        </q-avatar>
        <span class="font-smiley">邻里帮帮</span>
      </section>
      <div class="q-pa-md">
        <div class="q-gutter-y-md">
          <q-tabs v-model="tab" narrow-indicator dense align="justify">
            <q-tab text-primary name="login" icon="face_5" label="login" />
            <q-tab text-blue name="signup" icon="sign_language" label="sign up" />
          </q-tabs>
        </div>
      </div>
      <QForm v-if="tab === 'login'" ref="loginFormRef" class="q-gutter-md" @submit="onLoginSubmit"
        @reset="onFormReset(loginFormRef)">
        <q-input v-model="loginForm.username" outlined label="用户名 *" hint="用户名" lazy-rules
          :rules="[val => val && val.length > 0 || '请输入用户名']" />

        <q-input v-model="loginForm.password" type="password" outlined label="密码 *" hint="密码" lazy-rules
          :rules="[val => val && val.length > 0 || '请输入密码']" />

        <div>
          <q-btn label="登录" type="submit" color="primary" />
          <q-btn label="重置" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </QForm>
      <QForm v-if="tab === 'signup'" ref="signupFormRef" class="q-gutter-md" @submit="onSignupSubmit"
        @reset="onFormReset(signupFormRef)">
        <q-input v-model="signupForm.email" outlined label="账号 *" hint="账号" lazy-rules
          :rules="[val => val && val.length > 0 || '请输入账号']" />

        <q-input v-model="signupForm.password" type="password" outlined label="密码 *" hint="密码" lazy-rules
          :rules="[val => val && val.length > 0 || '请输入密码']" />

        <q-input v-model="signupForm.password2" type="password" outlined label="密码 *" hint="密码" lazy-rules :rules="[
          val => val && val.length > 0 || '请再次输入密码',
          val => val === signupForm.password || '两次密码不一致',
        ]" />

        <div>
          <q-btn label="注册" type="submit" color="primary" />
          <q-btn label="重置" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </QForm>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  width: 152px;
  height: 74px;
  border-radius: 6px;
  text-align: center;
  font-size: 30px;
  vertical-align: bottom;

  /* border-l */
}
</style>
