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
  <li v-if="item.component && !isHidden">
    <component :is="item.component" v-bind="item.props" />
  </li>
  <li
    v-else-if="item.header && !isHidden"
    class="vsm--header"
    :class="item.class"
    v-bind="item.attributes"
  >
    {{ item.header }}
  </li>
  <li
    v-else-if="!isHidden"
    :class="itemClass"
    @mouseover="onMouseOver"
    @mouseout="onMouseOut"
    v-on="
      isCollapsed && isFirstLevel
        ? { mouseenter: onMouseEnter, mouseleave: onMouseLeave }
        : {}
    "
  >
    <component
      :is="linkComponentName ? linkComponentName : 'SidebarMenuLink'"
      :item="item"
      :class="linkClass"
      v-bind="linkAttrs"
      @click="onLinkClick"
    >
      <template v-if="isCollapsed && isFirstLevel">
        <transition name="slide-animation">
          <div
            v-if="hover"
            class="vsm--mobile-bg"
            :style="mobileItemBackgroundStyle"
          />
        </transition>
      </template>
      <sidebar-menu-icon v-if="item.icon" :icon="item.icon" />
      <div
        class="vsm--title"
        :class="
          isCollapsed && isFirstLevel && !isMobileItem && 'vsm--title_hidden'
        "
        :style="isMobileItem && mobileItemStyle"
      >
        <span>{{ item.title }}</span>
        <sidebar-menu-badge v-if="item.badge" :badge="item.badge" />
        <div
          v-if="hasChild"
          class="vsm--arrow"
          :class="{ 'vsm--arrow_open': show }"
        >
          <slot name="dropdown-icon" v-bind="{ isOpen: show }" />
        </div>
      </div>
    </component>
    <template v-if="hasChild">
      <transition
        :appear="isMobileItem"
        name="expand"
        @enter="onExpandEnter"
        @afterEnter="onExpandAfterEnter"
        @beforeLeave="onExpandBeforeLeave"
        @afterLeave="onExpandAfterLeave"
      >
        <div
          v-if="show"
          class="vsm--child"
          :class="isMobileItem && 'vsm--child_mobile'"
          :style="isMobileItem && mobileItemDropdownStyle"
        >
          <ul class="vsm--dropdown">
            <sidebar-menu-item
              v-for="(subItem, index) in item.child"
              :key="index"
              :item="subItem"
              :level="level + 1"
            >
              <template #dropdown-icon="{ isOpen }">
                <slot name="dropdown-icon" v-bind="{ isOpen }" />
              </template>
            </sidebar-menu-item>
          </ul>
        </div>
      </transition>
    </template>
  </li>
</template>

<script>
import { toRefs, inject, watch } from "vue";
import useMenu from "@/scripts/Sidebar/useMenu";
import useItem from "@/scripts/Sidebar/useItem";

import SidebarMenuLink from "./SidebarMenuLink.vue";
import SidebarMenuIcon from "./SidebarMenuIcon.vue";
import SidebarMenuBadge from "./SidebarMenuBadge.vue";

export default {
  name: "SidebarMenuItem",
  components: {
    SidebarMenuLink,
    SidebarMenuIcon,
    SidebarMenuBadge,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    level: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const sidebarProps = inject("vsm-props");
    const {
      isCollapsed,
      mobileItemStyle,
      mobileItemDropdownStyle,
      mobileItemBackgroundStyle,
    } = useMenu(sidebarProps);
    const { linkComponentName } = toRefs(sidebarProps);
    const {
      active,
      exactActive,
      show,
      hover,
      isFirstLevel,
      isHidden,
      hasChild,
      linkClass,
      linkAttrs,
      itemClass,
      isMobileItem,
      onLinkClick,
      onMouseOver,
      onMouseOut,
      onMouseEnter,
      onMouseLeave,
      onExpandEnter,
      onExpandAfterEnter,
      onExpandBeforeLeave,
      onExpandAfterLeave,
    } = useItem(props);

    watch(
      () => active.value,
      () => {
        if (active.value) {
          show.value = true;
        }
      },
      {
        immediate: true,
      }
    );

    return {
      isCollapsed,
      linkComponentName,
      active,
      exactActive,
      isMobileItem,
      mobileItemStyle,
      mobileItemDropdownStyle,
      mobileItemBackgroundStyle,
      show,
      hover,
      isFirstLevel,
      isHidden,
      hasChild,
      linkClass,
      linkAttrs,
      itemClass,
      onLinkClick,
      onMouseOver,
      onMouseOut,
      onMouseEnter,
      onMouseLeave,
      onExpandEnter,
      onExpandAfterEnter,
      onExpandBeforeLeave,
      onExpandAfterLeave,
    };
  },
};
</script>
