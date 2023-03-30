<script setup lang='ts'>
import { AuthService } from 'src/service/auth.service'

const logout = () => {
  AuthService.getInstance().logout()
}
</script>

<template>
  <q-toolbar>
    <q-toolbar-title flex justify-between>
      <section class="logo">
        <q-avatar square mr-2>
          <img src="src/assets/smile.svg" @click="logout">
        </q-avatar>
        <span class="font-smiley">邻里帮帮</span>
      </section>
      <q-btn-dropdown flat label="more">
        <div class="row no-wrap q-pa-md">
          <div class="column items-center">
            <q-avatar size="72px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>

            <div class="text-subtitle1 q-mt-md q-mb-xs">
              John Doe
            </div>

            <q-btn color="primary" label="Logout" push size="sm" @click="logout" />
          </div>
        </div>
      </q-btn-dropdown>
    </q-toolbar-title>
  </q-toolbar>
</template>

<style lang='scss' scoped></style>
