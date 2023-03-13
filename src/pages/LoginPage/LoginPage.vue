<template>
  <div h-screen flex items-center justify-center>
    <div class="login-wrapper" flex flex-col content-center>
      <img class="logo" mx-auto src="/src/assets/logo.png" alt="logo">
      <q-form ref="loginForm" @submit="onSafeSubmit" @reset="onReset" class="q-gutter-md">
        <q-input outlined v-model="account" label="账号 *" hint="账号" lazy-rules
          :rules="[val => val && val.length > 0 || '请输入账号']" />

        <q-input type='password' outlined v-model="password" label="密码 *" hint="密码" lazy-rules
          :rules="[val => val && val.length > 0 || '请输入密码']" />

        <q-toggle v-model="accept" label="I accept the license and terms" />

        <div>
          <q-btn label="登录" type="submit" color="primary" />
          <q-btn label="重置" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { andThen, pipe } from 'ramda'

const loginForm = ref()
const account = ref('');
const password = ref('');
const accept = ref(false);

function validate(): Promise<string> {
  return loginForm.value.validate().then(success => {
    if (success) {
      // model 数据验证通过
      console.log('校验通过')
      return '校验通过'
    }
    else {
      // 数据验证失败
      // 用户至少输入了一个无效值
      console.log('校验失败')
      throw '校验失败'
    }
  })
}

function onSubmit() {
  console.log('提交表单')
}

// 重置表单
function onReset() {
  loginForm.value.resetValidation()
}

const onSafeSubmit = pipe(
  validate,
  andThen(onSubmit)
)


</script>

<style lang="scss" scoped>
.logo {
  width: 152px;
  height: 74px;
  border-radius: 6px;
  /* border-l */
}

.login-wrapper>* {
  margin-bottom: 24px;
}
</style>
