<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar> </q-avatar>
          Party Game
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="q-pa-lg">
        <router-view />
      </q-page>
    </q-page-container>
    <q-footer
      elevated
      class="lt-md bg-primary text-white shadow-2 overflow-hidden no-scroll"
    >
      <q-tabs class="flex-center" dense>
        <q-tab
          class="q-px-none"
          style="flex: 1 1 0"
          name="sports_esports"
          icon="sports_esports"
          label="Games"
        />
        <q-tab
          class="q-px-none"
          style="flex: 1 1 0"
          name="home"
          icon="home"
          label="home"
        />
        <q-tab
          class="q-px-none"
          style="flex: 1 1 0"
          name="notifications"
          icon="notifications"
          label="notifications"
        />
        <q-tab
          class="q-px-none"
          style="flex: 1 1 0"
          name="settings"
          icon="settings"
          label="settings"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.q-page {
  width: clamp(320px, 100vw, 768px);
  margin: 0 auto;
}
</style>
