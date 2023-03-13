<template>
  <q-layout view="hHh lpr fFf">

    <q-header bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar square>
            <img bg-white src="src/assets/smile.svg">
          </q-avatar>
          title
        </q-toolbar-title>
      </q-toolbar>

    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer bordered class="bg-white text-primary">
      footer
    </q-footer>

  </q-layout>
</template>

<script setup lang='ts'>

</script>

<style lang='scss' scoped></style>
