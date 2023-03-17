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
      <q-form v-if="tab === 'login'" ref="loginFormRef" @submit="onLoginSubmit" @reset="onFormReset(loginFormRef)"
        class="q-gutter-md">
        <q-input outlined v-model="loginForm.email" label="账号 *" hint="账号" lazy-rules
          :rules="[val => val && val.length > 0 || '请输入账号']" />

        <q-input type='password' outlined v-model="loginForm.password" label="密码 *" hint="密码" lazy-rules
          :rules="[val => val && val.length > 0 || '请输入密码']" />


        <div>
          <q-btn label="登录" type="submit" color="primary" />
          <q-btn label="重置" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
      <q-form v-if="tab === 'signup'" ref="signupFormRef" @submit="onSignupSubmit" @reset="onFormReset(signupFormRef)"
        class="q-gutter-md">
        <q-input outlined v-model="signupForm.email" label="账号 *" hint="账号" lazy-rules
          :rules="[val => val && val.length > 0 || '请输入账号']" />

        <q-input type='password' outlined v-model="signupForm.password" label="密码 *" hint="密码" lazy-rules
          :rules="[val => val && val.length > 0 || '请输入密码']" />

        <q-input type='password' outlined v-model="signupForm.password2" label="密码 *" hint="密码" lazy-rules :rules="[
          val => val && val.length > 0 || '请再次输入密码',
          val => val === signupForm.password || '两次密码不一致'
        ]" />

        <div>
          <q-btn label="注册" type="submit" color="primary" />
          <q-btn label="重置" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QForm } from 'quasar';

const router = useRouter();

// login sign up controller

const tab = ref<'login' | 'signup'>('login')

function onFormReset(form: QForm | undefined) {
  console.log('reset');
  if (!form) throw 'form not found';
  form.resetValidation();
}


// login

const loginFormRef = ref<QForm | undefined>();
const loginForm = reactive({
  email: '',
  password: '',
  accept: false,
})

function onLoginSubmit() {
  console.log('提交表单 login in')
  router.push('/home')
}

// sign up

const signupFormRef = ref<QForm | undefined>();

const signupForm = reactive({
  email: '',
  username: '',
  password: '',
  password2: '',
});

function onSignupSubmit() {
  console.log('提交表单 sign up')
  alert('注册成功')
}

</script>

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
