<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Music Server</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-loading :isOpen="loadingIsOpen" message="Loading..."> </ion-loading>
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <!-- <strong class="capitalize">{{ $route.params.id }}</strong>

        <p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p> -->

        <ion-list>
          <ion-item
            v-for="(displayLine, index) in displayLines"
            @click="clickItem(index)"
          >
            <ion-icon
              :icon="chevronForward"
              :class="{ invisible: !displayLine.IsSelected }"
            ></ion-icon>
            <ion-label>{{ displayLine.Text }}</ion-label>
          </ion-item>
        </ion-list>

        <ion-button @click="updateList" :disabled="progressBarIsOpen">
          <ion-icon :icon="refresh"></ion-icon>
        </ion-button>
        <ion-button @click="executeCommandAndUpdate(Command.CursorLeft)" :disabled="progressBarIsOpen">
          <ion-icon :icon="chevronBack"></ion-icon>
        </ion-button>
        <ion-button @click="executeCommandAndUpdate(Command.CursorRight)" :disabled="progressBarIsOpen">
          <ion-icon :icon="chevronForward"></ion-icon>
        </ion-button>
        <ion-button @click="executeCommandAndUpdate(Command.CursorUp)" :disabled="progressBarIsOpen">
          <ion-icon :icon="chevronUp"></ion-icon>
        </ion-button>
        <ion-button @click="executeCommandAndUpdate(Command.CursorDown)" :disabled="progressBarIsOpen">
          <ion-icon :icon="chevronDown"></ion-icon>
        </ion-button>
        <ion-button @click="executeCommandAndUpdate(Command.PagePrevious)" :disabled="progressBarIsOpen">
          <ion-icon :icon="caretDown"></ion-icon>
        </ion-button>
        <ion-button @click="executeCommandAndUpdate(Command.PageNext)" :disabled="progressBarIsOpen">
          <ion-icon :icon="caretUp"></ion-icon>
        </ion-button>
      </div>
    </ion-content>
    <ion-progress-bar v-if="progressBarIsOpen" type="indeterminate"></ion-progress-bar>
  </ion-page>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, Ref } from "vue";
import {
  IonAlert,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonProgressBar,
  IonTitle,
  IonToolbar,
  onIonViewWillEnter,
  onIonViewWillLeave,
} from "@ionic/vue";
import {
  caretUp,
  caretDown,
  chevronBack,
  chevronForward,
  chevronDown,
  chevronUp,
  refresh,
} from "ionicons/icons";
import { Device, DeviceInfo } from "@capacitor/device";
import { IDenonApiClient } from "@/api/denon/IDenonApiClient";
import { Command } from "@/api/denon/Command";
import { InputFuncSelect } from "@/api/denon/types";

onMounted(async () => {
  await logDeviceInfo();
});

const logDeviceInfo = async () => {
  const deviceInfo = await Device.getInfo();
  console.log(deviceInfo);
};

const progressBarIsOpen = ref<boolean>(false);
const loadingIsOpen = ref<boolean>(false);

const client: Ref<IDenonApiClient> | undefined = inject('client')

// Vue lifecycle methods: https://ionicframework.com/docs/vue/lifecycle
onIonViewWillEnter(async () => {
  console.log("onIonViewWillEnter");

  if (client?.value != undefined) {
    await setMusicServer();
  }

  // TODO: register polling
});

onIonViewWillLeave(async () => {
  console.log("onIonViewWillLeave");

  // TODO: unregister polling
});

async function setMusicServer() {
  loadingIsOpen.value = true;

  let mainStatusLite = await client?.value.mainStatusLite();

  // TODO: add max tries
  while (mainStatusLite?.InputFuncSelect != InputFuncSelect.MusicServer) {
    console.log("set input source to music server");
    await client?.value.executeCommand(Command.SourceServer);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    mainStatusLite = await client?.value.mainStatusLite();
  }

  updateList()

  loadingIsOpen.value = false;
}

async function executeCommandAndUpdate(command: Command) {
  progressBarIsOpen.value = true

  await client?.value.executeCommand(command);
  await new Promise((resolve) => setTimeout(resolve, 300));
  await updateList();

  progressBarIsOpen.value = false
}

async function clickItem(index: number) {
  progressBarIsOpen.value = true

  const selectedItemIndex = displayLines.value?.findIndex((item) => item.IsSelected);

  console.log("index: " + index + " selected: " + selectedItemIndex);

  if (selectedItemIndex != undefined) {
    if (selectedItemIndex > index) {
      for (let i = 0; i < selectedItemIndex - index; i++) {
        console.log("i:" + i);
        await client?.value.executeCommand(Command.CursorUp);
      }
    }
    if (selectedItemIndex < index) {
      for (let i = 0; i < index - selectedItemIndex; i++) {
        console.log("i:" + i);
        await client?.value.executeCommand(Command.CursorDown);
      }
    }
    await executeCommandAndUpdate(Command.CursorRight);
  }
}

export type DisplayLine = {
  Text: string;
  IsSelected: boolean;
  IsFile: boolean;
};

const displayLines = ref<Array<DisplayLine>>();

async function updateList() {
  let netAudioStatus = await client?.value.netAudioStatus();

  displayLines.value = new Array();

  netAudioStatus?.SzLine.forEach((element) => {
    let displayLine = <DisplayLine>{};
    displayLine.Text = element;
    displayLine.IsSelected = false;
    displayLine.IsFile = false;

    displayLines.value?.push(displayLine);
  });

  var index = netAudioStatus.ChFlag.findIndex((item) => item & 8); // TODO: check for other flags

  displayLines.value[index].IsSelected = true;
}
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container .invisible {
  visibility: hidden;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
