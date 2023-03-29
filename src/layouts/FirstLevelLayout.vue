<script setup lang='ts'>
import HeaderBar from 'src/components/HeaderBar.vue'
</script>

<template>
  <q-layout view="hHh lpr fFf">
    <q-header bordered class="bg-white text-black" height-hint="98">
      <HeaderBar />
    </q-header>

    <q-page-container>
      <router-view container mx-auto box-border />
    </q-page-container>

    <q-footer bordered class="bg-white text-coolGray">
      <q-tabs>
        <q-route-tab active-class="text-primary" label="Home" icon="home" to="/home" exact />
        <q-route-tab active-class="text-primary" label="Appointments" icon="event_note" to="/appointment" exact />
        <q-route-tab active-class="text-primary" label="Inbox" icon="question_answer" to="/inbox" exact />
        <q-route-tab active-class="text-primary" label="Profile" icon="badge" to="/profile" exact />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<style lang='scss' scoped></style>
