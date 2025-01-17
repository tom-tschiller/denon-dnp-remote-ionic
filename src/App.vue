<template>
  <ion-app>
    <ion-tabs>
      <ion-router-outlet id="main-content"></ion-router-outlet>

      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/folder/1">
          <ion-icon :icon="musicalNotes" />
          Music Server
        </ion-tab-button>
        <!-- <ion-tab-button tab="radio">
          <ion-icon :icon="radio" />
          Radio
        </ion-tab-button>
        <ion-tab-button tab="library">
          <ion-icon :icon="library" />
          Library
        </ion-tab-button> -->
        <ion-tab-button tab="search" href="/settings">
          <ion-icon :icon="settings" />
          Settings
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/vue';
import { ref } from 'vue';

import { musicalNotes, settings } from 'ionicons/icons';

const tabBarData = ref()

</script>

<style scoped>

</style>
