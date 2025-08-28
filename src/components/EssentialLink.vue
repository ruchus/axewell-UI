<template>
  <q-item :class="route.name === link ? 'menu-button-pressed' : 'menu-button'" class="q-mt-md rounded-border" clickable
    :key="link" @click="goToPage(link, title)">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" :class="route.name === link ? 'icon-btns-pressed' : 'icon-btns'" size="25px" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="drawer-btns">{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },
    link: {
      type: String,
      default: '#'
    },
    icon: {
      type: String,
      default: ''
    }
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const selected = ref(null);

    const isSelected = (link) => {
      return selected.value === link;
    };

    const goToPage = (link, title) => {
      selected.value = link;
      router.push({ name: link });
    }

    return {
      goToPage,
      route,
      selected,
      isSelected
    }
  }
})
</script>
