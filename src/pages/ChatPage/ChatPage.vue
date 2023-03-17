<template>
  <section class="chat-page" bg-coolGray-100>
    <q-layout view="hHh lpr fFf">
      <q-header>
        <back-bar :title="'kwongliegaai'"></back-bar>
      </q-header>

      <q-page-container>
        <section class="chat-view">
          <div class="q-pa-md row justify-center">
            <div style="width: 100%; max-width: 400px">
              <q-chat-message name="me" avatar="https://cdn.quasar.dev/img/avatar1.jpg" :text="['hey, how are you?']"
                stamp="7 minutes ago" sent bg-color="primary" />
              <q-chat-message name="Jane" avatar="https://cdn.quasar.dev/img/avatar5.jpg"
                :text="['doing fine, how r you?']" stamp="4 minutes ago" text-color="black" bg-color="white" />
            </div>
          </div>
        </section>
      </q-page-container>

      <q-footer bordered class="bg-grey-8 text-white">
        <q-toolbar class="bg-grey-3 text-black row">
          <q-btn round flat icon="insert_emoticon" class="q-mr-sm" />
          <q-input rounded outlined dense class="WAL__field col-grow q-mr-sm" bg-color="white" v-model="message"
            placeholder="Type a message" />
          <q-btn round flat icon="mic" />
        </q-toolbar>
      </q-footer>

    </q-layout>
  </section>
</template>

<script setup lang='ts'>
import BackBar from 'src/components/BackBar.vue';
const message = ref('');
</script>

<style lang='scss' scoped></style>
