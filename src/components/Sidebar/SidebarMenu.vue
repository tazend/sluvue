<!--
  MIT License

  Copyright (c) 2018 yaminncco
  Copyright (c) 2021 Toni Harzendorf

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
-->
<template>
  <div
    ref="sidebarMenuRef"
    class="v-sidebar-menu"
    :class="sidebarClass"
    :style="{ 'max-width': sidebarWidth }"
  >
    <slot name="header" />
    <sidebar-menu-scroll>
      <ul
        class="vsm--menu"
        :style="{ width: sidebarWidth, position: 'static !important' }"
      >
        <sidebar-menu-item
          v-for="(item, index) in menu"
          :key="index"
          :item="item"
        >
          <template #dropdown-icon="{ isOpen }">
            <slot name="dropdown-icon" v-bind="{ isOpen }">
              <span class="vsm--arrow_default" />
            </slot>
          </template>
        </sidebar-menu-item>
      </ul>
    </sidebar-menu-scroll>
    <slot name="footer" />
    <button v-if="!hideToggle" class="vsm--toggle-btn" @click="onToggleClick">
      <slot name="toggle-icon">
        <span class="vsm--toggle-btn_default" />
      </slot>
    </button>
  </div>
</template>

<script>
import {
  provide,
  watch,
  toRefs,
  getCurrentInstance,
  onMounted,
  onUnmounted,
} from "vue";
import useMenu from "@/scripts/Sidebar/useMenu";

import SidebarMenuItem from "./SidebarMenuItem.vue";
import SidebarMenuScroll from "./SidebarMenuScroll.vue";

export default {
  name: "SidebarMenu",
  components: {
    SidebarMenuItem,
    SidebarMenuScroll,
  },
  props: {
    menu: {
      type: Array,
      required: true,
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "290px",
    },
    widthCollapsed: {
      type: String,
      default: "65px",
    },
    showChild: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "",
    },
    showOneChild: {
      type: Boolean,
      default: false,
    },
    rtl: {
      type: Boolean,
      default: false,
    },
    relative: {
      type: Boolean,
      default: false,
    },
    hideToggle: {
      type: Boolean,
      default: false,
    },
    disableHover: {
      type: Boolean,
      default: false,
    },
    linkComponentName: {
      type: String,
      default: undefined,
    },
  },
  emits: {
    "item-click"(event, item) {
      return !!(event && item);
    },
    "update:collapsed"(collapsed) {
      return !!(typeof collapsed === "boolean");
    },
  },
  setup(props, context) {
    provide("vsm-props", props);

    const {
      sidebarMenuRef,
      isCollapsed,
      sidebarWidth,
      sidebarClass,
      onToggleClick,
      onItemClick,
      onRouteChange,
      unsetMobileItem,
    } = useMenu(props, context);

    provide("emitItemClick", onItemClick);
    provide("emitScrollUpdate");
    provide("onRouteChange", onRouteChange);

    const { collapsed } = toRefs(props);
    isCollapsed.value = collapsed.value;

    watch(
      () => props.collapsed,
      (currentCollapsed) => {
        unsetMobileItem();
        isCollapsed.value = currentCollapsed;
      }
    );

    const router =
      getCurrentInstance().appContext.config.globalProperties.$router;
    if (!router) {
      onMounted(() => {
        window.addEventListener("hashchange", onRouteChange);
      });
      onUnmounted(() => {
        window.removeEventListener("hashchange", onRouteChange);
      });
    }

    return {
      sidebarMenuRef,
      isCollapsed,
      sidebarWidth,
      sidebarClass,
      onToggleClick,
      onItemClick,
      onRouteChange,
    };
  },
};
</script>

<style scoped lang="scss">
@import "@/scss/Sidebar/vue-sidebar-menu";
</style>
